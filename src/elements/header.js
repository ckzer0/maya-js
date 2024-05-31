import { classes, innerText, m } from "../lib";

export const Header = ({ title, variant }) => {
  const component = variant === "large" ? m.H1 : m.H2;
  return component(classes(`p2 m2`), innerText(title));
};
