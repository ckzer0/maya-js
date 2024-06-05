import { derived, valueIsSignal } from "../core";
import { getProperty } from "../core/core";

const getSignalledProp = (propType, prop) => {
  if (typeof prop === "string" || typeof prop === "object")
    return getProperty(propType, prop);

  if (typeof prop === "function") {
    const signalledProp = derived(prop);
    return getProperty(propType, signalledProp);
  }

  throw new Error(
    "prop passed in component should be only string, object or function"
  );
};

export const classes = (classNames) => getSignalledProp("classes", classNames);

export const style = (style) => getSignalledProp("style", style);

export const attribs = (attribs) => getSignalledProp("attribs", attribs);

export const innerText = (childText) => {
  const innerTextIsValid = (text) => {
    if (valueIsSignal(text)) return innerTextIsValid(text.value);
    if (typeof text !== "string" && typeof text !== "function") return false;
    return true;
  };
  if (!innerTextIsValid(childText))
    throw new Error("innerText only accepts string or function");
  return getSignalledProp("innerText", childText);
};

export const children = (...childNodes) => {
  const childIsValid = (child) => {
    if (valueIsSignal(child)) return childIsValid(child.value);
    if (!child?.tagName && typeof child !== "string") return false;
    return true;
  };

  const childrensList = [];
  childNodes.forEach((childNode) => {
    const child =
      typeof childNode === "function" ? derived(childNode) : childNode;
    if (!childIsValid(child)) {
      console.log(child);
      throw new Error("Invalid child node passed to children");
    }
    childrensList.push(child);
  });

  return getProperty("children", childrensList);
};
