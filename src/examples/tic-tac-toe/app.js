import { derived, signal } from "../../lib/core";
import {
  classes,
  innerText,
  mButton,
  mDiv,
  mH1,
  onClick,
} from "../../lib/html";
import { GridBoard } from "./components/GridBoard";

export const App = () => {
  const blankMoves = () =>
    Array.from(Array(9).keys())
      .map((index) => ({
        index,
        player: null,
      }))
      .map((move) => ({ ...move }));
  const playerXsTurn = signal(true);
  const winner = signal(null);
  const winCombo = signal(null);
  const moves = signal(blankMoves());

  const checkWin = () => {
    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winCombos.length; i++) {
      const [a, b, c] = winCombos[i];
      if (
        moves.value[a].player &&
        moves.value[a].player === moves.value[b].player &&
        moves.value[a].player === moves.value[c].player
      ) {
        winner.value = moves.value[a].player;
        winCombo.value = winCombos[i];
        return;
      }
    }
  };

  const onMove = (index) => {
    if (moves.value[index].player || winner.value) {
      return;
    }
    const newTurn = !playerXsTurn.value;
    const newMoves = [...moves.value];

    newMoves[index].player = playerXsTurn.value ? "X" : "O";
    moves.value = newMoves;
    checkWin();
    if (winner.value) return;
    playerXsTurn.value = newTurn;
  };

  const restartGame = () => {
    moves.value = blankMoves();
    playerXsTurn.value = true;
    winner.value = null;
    winCombo.value = null;
  };

  return mDiv(
    classes("ph4 mw6"),
    mH1(innerText("Tic Tac Toe")),
    mDiv(
      classes(derived(() => `f2 mb1 ${playerXsTurn.value ? "green" : "pink"}`)),
      innerText(
        derived(
          () =>
            `${playerXsTurn.value ? "X" : "O"}${
              winner.value ? " won!!!" : "'s turn"
            }`
        )
      )
    ),
    GridBoard({
      playerXsTurn,
      moves,
      onMove,
      winner,
      winCombo,
    }),
    mButton(
      classes("mt3 bn pa3 b br3 pointer"),
      innerText("Restart"),
      onClick(restartGame)
    )
  );
};
