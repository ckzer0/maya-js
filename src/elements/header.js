import { m } from "../lib";

export const Header = ({ title, variant }) => {
  const component = variant === "large" ? m.H1 : m.H2;

  return component({
    children: title,
    classNames: "p2 m2",
  });
};
