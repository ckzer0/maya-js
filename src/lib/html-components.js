import { eventKeys, htmlTagNames } from "./constants";
import { createEl, getProperty } from "./core";

export const m = {};
export const on = {};

htmlTagNames.forEach((tagName) => {
  const mayaTag = tagName
    .split("")
    .map((char, index) => (!index ? char.toUpperCase() : char))
    .join("");
  m[mayaTag] = (...props) => createEl(tagName, ...props);
});

eventKeys.forEach((eventKey) => {
  const eventName = eventKey.replace("on", "").toLowerCase();
  on[eventName] = (callback) => getProperty("event", { [eventKey]: callback });
});

export const classes = (classNames) => getProperty("classes", classNames);

export const style = (style) => getProperty("style", style);

export const attribs = (attribs) => getProperty("attribs", attribs);

export const innerText = (text) => text;

export const unfold = (signal, composer) => [signal, composer];

unfold.map = (arraySignal, mapFn) => [
  arraySignal,
  (arrayValue) => arrayValue.map(mapFn),
];

unfold.reduce = (arraySignal, reduceFn) => [
  arraySignal,
  (arrayValue) => arrayValue.reduce(reduceFn),
];

unfold.filter = (arraySignal, filterFn) => [
  arraySignal,
  (arrayValue) => arrayValue.filter(filterFn),
];
