import { MAYA } from "../../../../lib/maya";

export const TextBox = ({ onkeypress }) => {
  return MAYA.Input({
    type: "text",
    onkeypress: onkeypress,
    classNames: "border2-dark rad5 p2 h2",
  });
};
