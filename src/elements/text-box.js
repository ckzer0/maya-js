import { classes, m, on, attribs } from "../lib";

export const TextBox = ({ classNames = "", value, onkeypress }) => {
  return m.Input(
    classes(`pa3 br3 bw1 ba b--green ${classNames}`),
    attribs({ type: "text", value: value }),
    on.keypress(onkeypress)
  );
};
