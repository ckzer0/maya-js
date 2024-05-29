import { htmlTagNames } from "./constants";
import { createEl } from "./core";

export const m = {};

htmlTagNames.forEach((tagName) => {
  const mayaTag = tagName
    .split("")
    .map((char, index) => (!index ? char.toUpperCase() : char))
    .join("");
  m[mayaTag] = (props) => createEl(tagName, props);
});
