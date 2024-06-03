import { classes, derived, innerText, m, on, signal } from "../lib";

export const Header = ({ title, variant }) => {
  const hTag = variant === "large" ? m.H1 : m.H2;
  const toggle = signal(false);
  const colorClass = derived(() => (toggle.value ? "pl3 red" : "pl3 black"));

  const onTap = () => {
    toggle.value = !toggle.value;
  };

  return hTag(classes(colorClass), on.click(onTap), innerText(title));
};
