import { Button } from "../../elements";
import { derived, m, signal } from "../../lib";
import { Bulb } from "./components/bulb";

export const App = () => {
  const isBulbOn = signal(false);
  const buttonColor = derived(() =>
    isBulbOn.value ? "bg-light-gray black" : "bg-mid-gray light-gray"
  );

  return m.Div({
    class: () =>
      `absolute--fill vh-100 ${
        isBulbOn.value ? "bg-light-yellow" : "bg-dark-gray"
      }`,
    children: [
      Bulb({
        isOn: isBulbOn,
        classNames: "mb6",
      }),
      console.log("line after bulb is rendered"),
      m.Div({
        class:
          "absolute bottom-0 right-0 left-0 pa3 flex justify-center items-center",
        children: [
          Button({
            color: buttonColor,
            onTap: () => (isBulbOn.value = !isBulbOn.value),
            label: `switch`,
          }),
        ],
      }),
    ],
  });
};
