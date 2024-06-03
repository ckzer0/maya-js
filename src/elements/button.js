import { classes, innerText, mButton, onClick } from "../lib/html";

export const Button = ({ onclick, label }) =>
  mButton(
    classes(`br3 bg-green white pa3 bn`),
    onClick(onclick),
    innerText(label)
  );
