import { m, signal } from "../lib";

export const Header = ({ title, variant }) => {
  const hTag = variant === "large" ? m.H1 : m.H2;
  const toggle = signal(false);

  const onTap = () => {
    toggle.value = !toggle.value;
  };

  return hTag({
    class: () => `${toggle.value ? "pl3 red" : "pl3 black"}`,
    onclick: onTap,
    innerText: title,
  });
};
