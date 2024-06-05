import { Component, m } from "../lib/html";

let buttonRenderCount = 0;

export const Button = Component(({ classNames, onTap, label, color }) => {
  console.log(`Button rendered ${++buttonRenderCount} times`);
  return m.Button({
    class: () =>
      `pa3 b br3 ba bw1 b--gray pointer ${color?.value || "bg-green  white"} ${
        classNames?.value || ""
      }`,
    onclick: onTap,
    innerText: label,
  });
});
