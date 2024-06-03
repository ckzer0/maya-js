import { derived, signal } from "../lib/core";
import { classes, innerText, mH1, mH2, onClick } from "../lib/html";

export const Header = ({ title, variant }) => {
  const hTag = variant === "large" ? mH1 : mH2;
  const toggle = signal(false);
  const colorClass = derived(() => (toggle.value ? "pl3 red" : "pl3 black"));

  const onTap = () => {
    toggle.value = !toggle.value;
  };

  return hTag(classes(colorClass), onClick(onTap), innerText(title));
};
