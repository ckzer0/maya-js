import { eventKeys } from "./constants";

let elId = 0;
const getNewId = () => elId++;

export const getProperty = (propKey, propValue) => ({ [propKey]: propValue });

export const valueIsSignal = (value) => !!(value?.type === "signal");

export const valueIsSignalsList = (value) =>
  Array.isArray(value) && value.every((v) => valueIsSignal(v));

export const valueIsSignalOrSignalsList = (value) => {
  if (valueIsSignal(value)) return true;
  if (valueIsSignalsList(value)) return true;
  return false;
};

export const valueIsSignalTuple = (value) =>
  Array.isArray(value) &&
  value.length === 2 &&
  valueIsSignal(value[0]) &&
  !valueIsSignal(value[1]) &&
  (typeof value[1] === "function" || value[1] === undefined);

export const valueIsSignalBased = (value) =>
  valueIsSignalOrSignalsList(value) || valueIsSignalTuple(value);

const getSignalTuple = (signalBasedValue) =>
  valueIsSignalTuple(signalBasedValue)
    ? signalBasedValue
    : [signalBasedValue, undefined];

export const extractValue = (signal, extractor) =>
  extractor ? extractor(signal) : signal();

const setAttribute = (el, attrKey, attrValue) => {
  if (attrKey === "value") {
    el.value = attrValue;
  } else {
    el.setAttribute(attrKey, attrValue);
  }
};

const handleAttributeProps = (el, attributes) => {
  Object.entries(attributes).forEach(([attrKey, attrValue]) => {
    if (eventKeys.includes(attrKey) && typeof attrValue === "function")
      throw new Error(
        "event handler method should not be assigned inside attributes"
      );

    if (valueIsSignalBased(attrValue)) {
      const signalTuple = getSignalTuple(attrValue);
      const [signal, extractor] = signalTuple;

      signal.addListenerDomNode(el);
      el.attrMutations.push({
        attributeKey: attrKey,
        signalTuple,
      });
      attrValue = extractValue(signal, extractor);
    }

    setAttribute(el, attrKey, attrValue);
  });
};

const setChild = (el, child, updateChildIndex) => {
  if (!child) return;

  if (
    updateChildIndex === undefined ||
    typeof child === "string" ||
    !el.hasChildNodes()
  ) {
    console.log(child);
    if (typeof child === "string") {
      el.innerText = child;
    } else {
      el.appendChild(child);
    }
    return;
  }

  console.log(el.childNodes[updateChildIndex]);
  console.log(child);
  el.replaceChild(child, el.childNodes[updateChildIndex]);
};

const handleChildrenProps = (el, children) => {
  children.forEach((child) => {
    let childNode = child.node;
    if (valueIsSignalBased(child.node)) {
      const signalTuple = getSignalTuple(child.node);
      const [signal, extractor] = signalTuple;

      signal.addListenerDomNode(el);
      el.childMutations.push({ signalTuple });
      childNode = extractValue(signal, extractor);
    }

    setChild(el, childNode);
  });
};

const handleEventProps = (el, events) => {
  Object.entries(events).forEach(([eventName, listenerFn]) => {
    const eventKey = eventName.slice(2);
    el.addEventListener(eventKey, (e) => {
      if (eventKey === "keypress") {
        e.preventDefault();
      }
      listenerFn(e);
    });
  });
};

const getNodesEventsAndAttributes = (...args) => {
  const children = [];
  const events = {};
  const attributes = {};

  args.forEach((arg) => {
    if (arg.tagName || valueIsSignalBased(arg) || typeof arg === "string") {
      if (valueIsSignalsList(arg)) {
        arg.forEach((argItem) =>
          children.push({
            index: children.length,
            node: argItem,
          })
        );
      } else {
        children.push({
          index: children.length,
          node: arg,
        });
      }
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
              throw new Error("Invalid event");
            }
          } else {
            throw new Error("Invalid attribute or event");
          }
        } else {
          console.log(arg);
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

export const createEl = (tagName, ...args) => {
  const el = document.createElement(tagName);
  el.mayaId = getNewId();
  el.childMutations = [];
  el.attrMutations = [];

  const { children, events, attributes } = getNodesEventsAndAttributes(...args);

  console.log("-----------------");
  console.log(el.tagName);
  handleAttributeProps(el, attributes);
  handleChildrenProps(el, children);
  handleEventProps(el, events);
  console.log("-----------------");
  console.log("\n\n");

  el.addEventListener("signalChange", (event) => {
    const { signalId, signalUpdaterMessage } = event.detail;

    const attrMuts = el.attrMutations.filter((m) => {
      const [signal, _] = m.signalTuple;
      return signalId === signal.id;
    });
    attrMuts.forEach((mutation) => {
      const {
        signalTuple: [signal, extractor],
        attributeKey,
      } = mutation;
      const value = extractValue(signal, extractor);
      setAttribute(el, attributeKey, value);
    });

    const childMuts = el.childMutations.filter((m) => {
      const [signal, _] = m.signalTuple;
      return signalId === signal.id;
    });
    childMuts.forEach((mutation) => {
      const {
        signalTuple: [signal, extractor],
      } = mutation;
      console.log(signal);
      console.log(signalUpdaterMessage);
      const child = extractValue(signal, extractor);
      console.log(child);
      setChild(el, child, signalUpdaterMessage?.childIndex);
    });
  });

  return el;
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
 * [signal, extractor]
 * el
 */
