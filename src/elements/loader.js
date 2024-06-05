import { m } from "../lib/html";

export const Loader = ({ classNames } = {}) => {
  return m.Div({
    class: `flex justify-center items-center ${classNames || ""}`,
    children: [
      m.Div({
        class: "loader",
      }),
    ],
  });
};
