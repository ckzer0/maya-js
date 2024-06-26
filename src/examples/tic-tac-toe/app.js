import { Button, Loader } from "../../elements";
import { m, signal } from "../../lib";
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
  const isBusy = signal(false);

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

  const onMove = async (index) => {
    if (moves.value[index].player || winner.value) {
      console.log("winner already declared");
      return;
    }
    await mockNewtorkLag();
    const newTurn = !playerXsTurn.value;
    const newMoves = [...moves.value];

    newMoves[index].player = playerXsTurn.value ? "X" : "O";
    moves.value = newMoves;
    checkWin();
    if (winner.value) return;
    playerXsTurn.value = newTurn;
  };

  const mockNewtorkLag = async (ms = 300) => {
    console.log("processing on network...");
    isBusy.value = true;
    await new Promise((resolve) => setTimeout(resolve, ms));
    isBusy.value = false;
    console.log("processing done.");
  };

  const restartGame = () => {
    moves.value = blankMoves();
    playerXsTurn.value = true;
    winner.value = null;
    winCombo.value = null;
  };

  return m.Div({
    class: "ph4 mw6",
    children: [
      m.H1({
        innerText: "Tic Tac Toe",
      }),
      m.Div({
        class: "flex items-center",
        children: [
          m.Div({
            class: () => `f2 mb1 ${playerXsTurn.value ? "green" : "pink"}`,
            innerText: () =>
              `${playerXsTurn.value ? "X" : "O"}${
                winner.value ? " won!!!" : "'s turn"
              }`,
          }),
          () =>
            m.Span({
              class: "ml3",
              children: [
                () =>
                  isBusy.value
                    ? Loader()
                    : m.Span({
                        class: "f2",
                        innerText: "✓",
                      }),
              ],
            }),
        ],
      }),
      GridBoard({
        playerXsTurn,
        moves,
        onMove,
        winner,
        winCombo,
      }),
      Button({
        classNames: "mt4",
        color: "bg-gray white",
        onTap: restartGame,
        label: "Restart",
      }),
    ],
  });
};
