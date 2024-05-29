import { m } from "../../../lib";

const Block = ({ children, onclick }) => {
  return m.Div({
    classNames:
      "flex items-center justify-center tc br3 ba b--gray bg-white f1 b h5 pointer",
    children: children,
    onclick: onclick,
  });
};

export const GridBoard = ({ firstPlayerTurn, moves, onMove }) => {
  const blocks = Array.from(Array(9).keys());

  return m.Div({
    classNames: [
      firstPlayerTurn,
      (s) => `grid3x3 pa4 bg-light-${s ? "green" : "pink"}`,
    ],
    children: blocks.map((_, index) => {
      const content = moves().find((move) => move.index === index);
      return Block({
        children: [
          moves,
          (sigValue) =>
            sigValue.find((move) => move.index === index)?.player || "•",
        ],
        onclick: () => onMove(index),
      });
    }),
  });
};
