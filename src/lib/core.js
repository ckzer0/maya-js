import { eventKeys } from "./constants";

let elId = 0;
const getNewId = () => elId++;

export const getProperty = (propKey, propValue) => ({ [propKey]: propValue });

const valueIsSignalTuple = (value) =>
  Array.isArray(value) && value.length === 2 && value[0]?.type === "signal";

const valueIsSignalBased = (value) =>
  value?.type === "signal" || valueIsSignalTuple(value);

const handleSignalBasedProp = (el, signalBasedValue, propHandler) => {
  const isTuple = valueIsSignalTuple(signalBasedValue);
  const [signal, composer] = isTuple ? signalBasedValue : [signalBasedValue];
  signal.addSubscriber(el);
  el.addEventListener("signalChange", (event) => {
    const { signalId } = event.detail;
    if (signalId === signal.id) {
      const attrValue = signal(composer);
      propHandler(el, attrValue);
    }
  });
  propHandler(el, signal(composer));
};

const handleAttributeProp = (el, attrKey, attrValue) => {
  const setAttribute = (el, attrValue) => {
    if (attrKey === "value") {
      el.value = attrValue;
    } else {
      el.setAttribute(attrKey, attrValue);
    }
  };

  if (valueIsSignalBased(attrValue)) {
    handleSignalBasedProp(el, attrValue, setAttribute);
  } else {
    setAttribute(el, attrValue);
  }
};

const handleEventProp = (el, propKey, propValue) => {
  const eventKey = propKey.slice(2);
  const listenerFn = propValue;
  el.addEventListener(eventKey, (e) => {
    if (eventKey === "keypress") {
      e.preventDefault();
    }
    listenerFn(e);
  });
};

const handleChildrenProp = (el, children) => {
  const appendChildren = (el, children, replaceChildrenOnSignal = true) => {
    if (replaceChildrenOnSignal) el.replaceChildren();
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (typeof child === "string") {
          el.innerText = child;
        } else {
          el.appendChild(child);
        }
      });
    } else if (typeof children === "string") {
      el.innerText = children;
    } else {
      el.appendChild(children);
    }
  };

  children.forEach((child) => {
    if (typeof child === "string") {
      el.innerText = child;
    } else if (valueIsSignalBased(child)) {
      console.log("yes it is");
      handleSignalBasedProp(el, child, appendChildren);
    } else {
      appendChildren(el, child, false);
    }
  });
};

const getNodesEventsAndAttributes = (...args) => {
  const children = [];
  const events = {};
  const attributes = {};

  args.forEach((arg) => {
    if (arg.tagName || valueIsSignalBased(arg) || typeof arg === "string") {
      children.push(arg);
    } else {
      if (typeof arg === "object") {
        const entries = Object.entries(arg);
        if (entries.length === 1) {
          const [propKey, propValue] = entries[0];

          if (propKey === "classes") {
            Object.assign(attributes, { class: propValue });
          } else if (propKey === "style") {
            Object.assign(attributes, { style: propValue });
          } else if (propKey === "attribs") {
            Object.assign(attributes, propValue);
          } else if (propKey === "event") {
            const [eventKey, eventValue] = Object.entries(propValue)[0];
            if (
              eventKeys.includes(eventKey) &&
              typeof eventValue === "function"
            ) {
              Object.assign(events, propValue);
            } else {
              // console.log(propKey, propValue);
              throw new Error("Invalid event");
            }
          } else {
            // console.log(propKey);
            // console.log(propValue);
            throw new Error("Invalid attribute or event");
          }
        } else {
          console.log(entries);
          throw new Error("Attribute length is greater than 1");
        }
      } else {
        throw new Error("Invalid prop passed to maya node");
      }
    }
  });

  return { children, events, attributes };
};

/**
 * PROPS OF AN ELEMENT
 *
 * { "className": "some class" }
 * { "style": "some: style;" }
 * {
 *   "attribs": {
 *     "type": "text",
 *     "value": "some value",
 *   }
 * }
 * {
 *   "event": {
 *     "onclick": () => console.log("clicked"),
 *   }
 * }
 * [signal, composer]
 * el
 */
export const createEl = (tagName, ...args) => {
  const el = document.createElement(tagName);
  el.mayaId = getNewId();
  const { children, events, attributes } = getNodesEventsAndAttributes(...args);

  handleChildrenProp(el, children);
  Object.entries(events).forEach(([eventKey, eventValue]) =>
    handleEventProp(el, eventKey, eventValue)
  );
  Object.entries(attributes).forEach(([attrKey, attrValue]) =>
    handleAttributeProp(el, attrKey, attrValue)
  );

  return el;
};
