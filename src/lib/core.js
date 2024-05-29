import { eventKeys } from "./constants";

let elId = 0;
const getNewId = () => elId++;

const valueIsSignalTuple = (value) =>
  Array.isArray(value) && value.length === 2 && value[0]?.type === "signal";

const valueIsSignalBased = (value) =>
  value?.type === "signal" || valueIsSignalTuple(value);

const handleSignalBasedProp = (el, attrKey, signalBasedValue, propHandler) => {
  const isTuple = valueIsSignalTuple(signalBasedValue);
  const [signal, composer] = isTuple ? signalBasedValue : [signalBasedValue];
  signal.addSubscriber(el);
  el.addEventListener("signalChange", (event) => {
    const { signalId } = event.detail;
    if (signalId === signal.id) {
      const attrValue = signal(composer);
      propHandler(el, attrKey, attrValue);
    }
  });
  propHandler(el, attrKey, signal(composer));
};

const handleAttributeProp = (el, attrKey, attrValue) => {
  const setAttribute = (el, attrKey, attrValue) => {
    if (attrKey === "value") {
      el.value = attrValue;
    } else {
      el.setAttribute(attrKey, attrValue);
    }
  };

  if (valueIsSignalBased(attrValue)) {
    handleSignalBasedProp(el, attrKey, attrValue, setAttribute);
  } else {
    setAttribute(el, attrKey, attrValue);
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
  const appendChildren = (el, _, children) => {
    el.replaceChildren();
    if (Array.isArray(children)) {
      children.forEach((child) => {
        el.appendChild(child);
      });
    } else if (typeof children === "string") {
      el.innerText = children;
    } else {
      el.appendChild(children);
    }
  };

  if (typeof children === "string") {
    el.innerText = children;
  } else if (valueIsSignalBased(children)) {
    handleSignalBasedProp(el, "children", children, appendChildren);
  } else {
    appendChildren(el, null, children);
  }
};

export const createEl = (tagName, props) => {
  const el = document.createElement(tagName);
  el.mayaId = getNewId();

  for (const [propKey, propValue] of Object.entries(props)) {
    if (propKey === "children") {
      handleChildrenProp(el, propValue);
    } else if (eventKeys.includes(propKey) && typeof propValue === "function") {
      handleEventProp(el, propKey, propValue);
    } else {
      const attrKey = propKey === "classNames" ? "class" : propKey;
      handleAttributeProp(el, attrKey, propValue);
    }
  }

  return el;
};
