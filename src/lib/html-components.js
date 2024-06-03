import { eventKeys, htmlTagNames } from "./constants";
import { createEl, getProperty, valueIsSignalBased } from "./core";
import { from, fromArraySignal, signal } from "./signal";

export const m = {};
export const on = {};

htmlTagNames.forEach((tagName) => {
  const mayaTag = tagName
    .split("")
    .map((char, index) => (!index ? char.toUpperCase() : char))
    .join("");
  m[mayaTag] = (...props) => createEl(tagName, ...props);
});

export const classes = (classNames, extractor) => {
  if (typeof classNames === "string") {
    return getProperty("classes", classNames);
  }
  if (classNames?.type === "signal") {
    return getProperty("classes", [classNames, extractor]);
  }
  throw new Error("Invalid classes argument");
};

export const style = (style) => getProperty("style", style);

export const attribs = (attribs) => getProperty("attribs", attribs);

eventKeys.forEach((eventKey) => {
  const eventName = eventKey.replace("on", "").toLowerCase();
  on[eventName] = (callback) => getProperty("event", { [eventKey]: callback });
});

export const innerText = (text) => text;

export const unfold = (arraySignal) => ({
  map: (mapFn) => {
    const componentsList = fromArraySignal(arraySignal).getSingalsList(mapFn);
    return componentsList;
  },
  reduce: (reduceFn) => [[arraySignal], (sig) => sig().reduce(reduceFn)],
  filter: (filterFn) => [[arraySignal], (sig) => sig().filter(filterFn)],
});
