import { classes, innerText, m, on } from "../lib";

export const Button = ({ onclick, label }) =>
  m.Button(
    classes(`br3 bg-green white pa3 bn`),
    on.click(onclick),
    innerText(label)
  );
