import { classes, from, innerText, m, on, signal } from "../lib";

export const Header = ({ title, variant }) => {
  const hTag = variant === "large" ? m.H1 : m.H2;
  const toggle = signal(false);
  const color = from(toggle).getSignal(() => (toggle() ? "red" : "black"));

  const onTap = () => toggle.set(!toggle());

  return hTag(
    classes(color, (colSignal) => `pl3 ${colSignal()}`),
    on.click(onTap),
    innerText(title)
  );
};
