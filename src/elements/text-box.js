import { m } from "../lib/html";

export const TextBox = ({ classNames = "", value, onkeypress }) => {
  return m.Input({
    class: `pa3 br3 bw1 ba b--green ${classNames}`,
    type: "text",
    value: value,
    onkeypress: onkeypress,
  });
};
