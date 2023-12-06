import { eventKeys } from "./constants";

export const createEl = (tagName, props) => {
  const el = document.createElement(tagName);

  for (const [key, value] of Object.entries(props)) {
    if (eventKeys.includes(key) && typeof value === "function") {
      const eventKey = key.slice(2);
      el.addEventListener(eventKey, value);
    } else if (key === "children") {
      if (typeof value === "string") {
        el.innerText = value;
      }
      if (Array.isArray(value)) {
        value.forEach((child) => {
          el.appendChild(child);
        });
      }
    } else if (key === "emitted") {
      el[key] = value;
    } else {
      const attrKey = key === "classNames" ? "class" : key;
      const attr = document.createAttribute(attrKey);
      attr.value = value;
      el.setAttributeNode(attr);
    }
  }

  return el;
};
