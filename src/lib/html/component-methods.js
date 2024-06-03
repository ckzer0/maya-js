import { getProperty } from "../core/core";

export const classes = (classNames) => getProperty("classes", classNames);

export const style = (style) => getProperty("style", style);

export const attribs = (attribs) => getProperty("attribs", attribs);

export const innerText = (text) => text;
