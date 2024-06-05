import { classes, innerText, mButton, onClick } from "../lib/html";

export const Button = ({ onTap, label, colored = true }) =>
  mButton(
    classes(`mt3 bn pa3 b br3 pointer ${colored ? "bg-green white" : ""}`),
    onClick(onTap),
    innerText(label)
  );
