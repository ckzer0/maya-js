import { Button } from "../../elements";
import { derived, m, signal } from "../../lib";
import { Bulb } from "./components/bulb";
import { PhotoFrame } from "./components/photo-frame";

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
      PhotoFrame({
        isBulbOn,
        frameSrc: "sample-assets/photo-frame.webp",
        photoSrc: "sample-assets/pp.png",
      }),
      m.Div({
        class: "mt7 pt6 flex justify-center items-center",
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
