import { m } from "../lib";

export const Button = ({ onclick, label }) =>
  m.Button({
    classNames: "br3 bg-green white pa3 bn",
    onclick: onclick,
    children: label,
  });
