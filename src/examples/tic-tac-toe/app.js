import { m, signal } from "../../lib";
import { GridBoard } from "./components/GridBoard";

export const App = () => {
  const firstPlayerTurn = signal(true);
  const moves = signal([]);

  const onMove = (index) => {
    const newMove = {
      index,
      player: firstPlayerTurn() ? "X" : "O",
    };
    const newMoves = moves().concat(newMove);
    moves.set(newMoves);
    firstPlayerTurn.set(!firstPlayerTurn());
  };

  return m.Div({
    classNames: "ph4",
    children: [
      m.H1({
        children: "Tic Tac Toe",
      }),
      GridBoard({ firstPlayerTurn, moves, onMove }),
    ],
  });
};
