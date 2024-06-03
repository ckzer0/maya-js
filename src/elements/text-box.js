import { attribs, classes, mInput, onKeyPress } from "../lib/html";

export const TextBox = ({ classNames = "", value, onkeypress }) => {
  return mInput(
    classes(`pa3 br3 bw1 ba b--green ${classNames}`),
    attribs({ type: "text", value: value }),
    onKeyPress(onkeypress)
  );
};
