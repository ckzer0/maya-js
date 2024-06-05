import { createEl, derived, valueIsSignal } from "../core";
import { htmlTagNames } from "./constants";

export const Component = (comp) => {
  return (props) => {
    const allProps = {};
    Object.entries(props || {}).forEach(([key, value]) => {
      allProps[key] =
        typeof value === "function"
          ? value
          : valueIsSignal(value)
          ? value
          : derived(() => value);
    });

    return comp(allProps);
  };
};

export const m = {};

htmlTagNames.forEach((tagName) => {
  const mayaTag = tagName
    .split("")
    .map((char, index) => (!index ? char.toUpperCase() : char))
    .join("");
  m[mayaTag] = (props) => createEl(tagName, props);
});
