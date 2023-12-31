import { MAYA } from "../../../lib/maya";

export const Button = ({ onclick, label }) =>
  MAYA.Button({
    onclick: onclick,
    children: label,
    classNames: "border2-dark rad5 ml2 p2 h4 bcol-teal col-white",
  });
