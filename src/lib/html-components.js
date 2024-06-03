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

export const classes = (classNames) => getProperty("classes", classNames);

export const style = (style) => getProperty("style", style);

export const attribs = (attribs) => getProperty("attribs", attribs);

eventKeys.forEach((eventKey) => {
  const eventName = eventKey.replace("on", "").toLowerCase();
  on[eventName] = (callback) => getProperty("event", { [eventKey]: callback });
});

export const innerText = (text) => text;
