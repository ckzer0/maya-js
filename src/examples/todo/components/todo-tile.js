import { derived, signal } from "../../../lib/core";
import {
  classes,
  innerText,
  mButton,
  mDiv,
  mSpan,
  onClick,
  style,
} from "../../../lib/html";

export const TodoTile = ({
  index,
  task,
  isDone,
  onDoneChange,
  onDelete,
  isLast,
}) => {
  const plainStyle = "display: flex; justify-content: space-between;";
  const styleWithBorder = `${plainStyle} border-bottom: 1px solid #ddd;`;
  const bgColor = signal("bg-light-transparent");
  const tileClasses = derived(
    () => `mt1 pa2 pointer ${!isDone ? bgColor.value + " dark-green" : ""}`
  );

  return mDiv(
    classes(tileClasses),
    style(`${isLast ? plainStyle : styleWithBorder}`),
    onClick(() => {
      onDoneChange(index);
      bgColor.value =
        bgColor.value === "bg-light-yellow"
          ? "bg-light-transparent"
          : "bg-light-yellow";
    }),
    mSpan(classes(isDone ? "strike" : ""), innerText(task)),
    mButton(
      classes(`mb1`),
      style(`display: inline-block;`),
      onClick((e) => {
        onDelete(index);
        e.stopPropagation();
      }),
      innerText("x")
    )
  );
};
