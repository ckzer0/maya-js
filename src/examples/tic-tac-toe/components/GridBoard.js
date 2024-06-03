import { classes, m, on } from "../../../lib";

const Block = ({ children, onclick }) => {
  return m.Div(
    classes(
      "flex items-center justify-center tc br3 ba b--gray bg-white f1 b h5 pointer"
    ),
    on.click(onclick),
    children
  );
};

export const GridBoard = ({ firstPlayerTurn, moves, onMove }) => {
  const blocks = Array.from(Array(9).keys());

  return m.Div(
    classes(
      firstPlayerTurn,
      (s) => `grid3x3 pa4 bg-light-${s ? "green" : "pink"}`
    ),
    ...blocks.map((_, index) => {
      return Block({
        children: [
          moves,
          (sigValue) =>
            sigValue.find((move) => move.index === index)?.player || "•",
        ],
        onclick: () => onMove(index),
      });
    })
  );
};
