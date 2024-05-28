import { MAYA } from "../../../../lib/maya";

export const Header = ({ title }) =>
  MAYA.H2({
    children: title,
    classNames: "p2 m2",
  });
