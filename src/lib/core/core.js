import { eventKeys } from "../html/constants";
import { derived, effect, valueIsSignal } from "./signal";

let elId = 0;
const getNewId = () => elId++;

const getPropValue = (prop) => {
  if (typeof prop === "string" || valueIsSignal(prop)) return prop;

  if (typeof prop === "function") {
    const signalledProp = derived(prop);
    return signalledProp;
  }

  console.log(typeof prop, prop);
  throw new Error(
    "prop passed in component should be only string, object or function"
  );
};

const attributeIsEvent = (attrKey, attrValue) =>
  eventKeys.includes(attrKey) && typeof attrValue === "function";

const handleAttributeProps = (el, attributes) => {
  const attribSignals = {};

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
    const [attrKey, attrVal] = attrib;
    const attrValue = getPropValue(attrVal);
    if (eventKeys.includes(attrKey) && typeof attrValue === "function")
      throw new Error(
        "event handler method should not be assigned inside attributes"
      );

    if (valueIsSignal(attrValue)) {
      attribSignals[attrKey] = attrValue;
    } else {
      setAttribute(el, attrKey, attrValue);
    }
  });

  effect(() => {
    Object.entries(attribSignals).forEach(([attrKey, attrValue]) => {
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
    const sanitisedNode = typeof node === "function" ? derived(node) : node;
    const child = getNode(sanitisedNode);
    if (!child) return;

    if (valueIsSignal(sanitisedNode)) {
      signalNodes.push({ index, node: sanitisedNode });
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

const getNodesEventsAndAttributes = (props) => {
  const children = [];
  const events = {};
  const attributes = {};

  Object.entries(props).forEach(([propKey, propValue]) => {
    if (propKey === "innerText") {
      children.push(propValue);
    } else if (propKey === "children") {
      children.push(...propValue);
    } else if (attributeIsEvent(propKey, propValue)) {
      events[propKey] = propValue;
    } else {
      attributes[propKey] = propValue;
    }
  });

  return { children, events, attributes };
};

export const createEl = (tagName, props) => {
  const el = document.createElement(tagName);
  el.mayaId = getNewId();

  // console.log("\n");
  // console.log(el.tagName);
  const { children, events, attributes } = getNodesEventsAndAttributes(props);
  handleAttributeProps(el, attributes);
  handleChildrenProps(el, children);
  handleEventProps(el, events);
  // console.log("----------------------");
  // console.log("\n\n");

  return el;
};
