import { htmlTagNames } from "./constants";
import { createEl } from "./core";

export const MAYA = {};

htmlTagNames.forEach((tagName) => {
  const mayaTag = tagName
    .split("")
    .map((char, index) => (!index ? char.toUpperCase() : char))
    .join("");
  MAYA[mayaTag] = (props) => createEl(tagName, props);
});
