import { MAYA, Mutate } from "../../../../../lib/maya";
import { Dispatch } from "../../../../../lib/store";

export const TodoTile = (firstRenderprops) => {
  const { task, isLast } = firstRenderprops;
  const plainStyle = "display: flex; justify-content: space-between;";
  const styleWithBorder = `${plainStyle} border-bottom: 1px solid #ddd;`;

  const tile = MAYA.Div({
    classNames: `mt2 pb2`,
    style: ` ${isLast ? plainStyle : styleWithBorder}`,
    children: [
      MAYA.Span({
        children: task,
      }),
      MAYA.Button({
        children: "x",
        style: "display: inline-block;",
        onclick: () => {
          console.log(`deleting node id: ${tile.mayaId}`);
          Dispatch("DELETE_TODO", tile);
        },
      }),
    ],
  });

  Mutate(tile.mayaId, "CHANGE_TILE_STYLE", () => {
    const isLastTile = tile.parentNode.lastChild.innerText === tile.innerText;
    const style = isLastTile ? plainStyle : styleWithBorder;
    tile.setAttribute("style", style);
  });

  return tile;
};
