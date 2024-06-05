import { eventKeys } from "../html/html-constants";
import { effect, valueIsSignal } from "./signal";

let elId = 0;
const getNewId = () => elId++;

export const getProperty = (propKey, propValue) => ({ [propKey]: propValue });

const handleAttributeProps = (el, attributes) => {
  const attribSignals = [];
  const getAttrValue = (attrValue) =>
    valueIsSignal(attrValue) ? getAttrValue(attrValue.value) : attrValue;

  const setAttribute = (el, attrKey, attrValue) => {
    if (attrKey === "value") {
      el.value = getAttrValue(attrValue);
    } else {
      el.setAttribute(attrKey, getAttrValue(attrValue));
    }
  };

  Object.entries(attributes).forEach((attrib) => {
    const [attrKey, attrValue] = attrib;
    if (eventKeys.includes(attrKey) && typeof attrValue === "function")
      throw new Error(
        "event handler method should not be assigned inside attributes"
      );

    if (valueIsSignal(attrValue)) {
      attribSignals.push(attrib);
    } else {
      setAttribute(el, attrKey, attrValue);
    }
  });

  effect(() => {
    attribSignals.forEach(([attrKey, attrValue]) => {
      setAttribute(el, attrKey, attrValue);
    });
  });
};

const handleChildrenProps = (el, children) => {
  const signalNodes = [];
  const getNode = (child) => {
    const mayaNode =
      typeof child === "string"
        ? document.createTextNode(child)
        : valueIsSignal(child)
        ? getNode(child.value)
        : child;

    return mayaNode;
  };

  children.forEach((node, index) => {
    const child = getNode(node);
    if (!child) return;

    if (valueIsSignal(node)) {
      signalNodes.push({ index, node });
    }
    el.appendChild(child);
  });

  if (signalNodes.length) {
    effect(() => {
      signalNodes.forEach(({ index, node }) => {
        const child = getNode(node.value);
        if (!child) return;

        el.replaceChild(child, el.childNodes[index]);
      });
    });
  }
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
    if (!arg) return;

    if (typeof arg === "object") {
      const entries = Object.entries(arg);
      if (entries.length === 1) {
        const [propKey, propValue] = entries[0];

        if (propKey === "innerText") {
          children.push(propValue);
        } else if (propKey === "children") {
          children.push(...propValue);
        } else if (propKey === "classes") {
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
        throw new Error("Attribute length is greater than 1");
      }
    } else {
      throw new Error("Invalid prop passed to maya node");
    }
  });

  return { children, events, attributes };
};

export const createEl = (tagName, ...args) => {
  const el = document.createElement(tagName);
  el.mayaId = getNewId();

  const { children, events, attributes } = getNodesEventsAndAttributes(...args);
  handleAttributeProps(el, attributes);
  handleChildrenProps(el, children);
  handleEventProps(el, events);

  return el;
};
