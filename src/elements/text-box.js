import { m } from "../lib";

export const TextBox = ({ classNames = "", value, onkeypress }) => {
  return m.Input({
    type: "text",
    value: value,
    onkeypress: onkeypress,
    classNames: `pa3 br3 bw1 ba b--green ${classNames}`,
  });
};
