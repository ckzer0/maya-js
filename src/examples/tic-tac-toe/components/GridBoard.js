import { children, classes, innerText, mDiv, onClick } from "../../../lib/html";

export const GridBoard = ({
  playerXsTurn,
  moves,
  onMove,
  winner,
  winCombo,
}) => {
  const blocks = Array.from(Array(9).keys());

  const getTextColor = (player) => (player === "X" ? "green" : "pink");
  const getBgColor = (player) =>
    player === "X" ? "bg-washed-green" : "bg-washed-pink";
  const getColorsCss = (player) =>
    `${getTextColor(player)} ${getBgColor(player)}`;

  return mDiv(
    classes(
      () =>
        `grid3x3 br4 pa4 ${
          !winner.value
            ? playerXsTurn.value
              ? "bg-light-green"
              : "bg-light-pink"
            : "bg-moon-gray banned"
        }`
    ),
    children(
      ...blocks.map((_, index) =>
        mDiv(
          classes(
            () =>
              `flex items-center mid-gray justify-center tc br3 ba b--gray bg-white f1 b h5 ${
                winner.value ? "banned" : "pointer"
              } ${
                winCombo.value?.includes(index)
                  ? getColorsCss(winner.value)
                  : ""
              }`
          ),
          onClick(() => onMove(index)),
          innerText(
            () =>
              moves.value.find((move) => move.index === index)?.player || "•"
          )
        )
      )
    )
  );
};
