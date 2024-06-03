import {
  classes,
  derived,
  innerText,
  m,
  on,
  signal,
  style,
} from "../../../lib";

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

  return m.Div(
    classes(tileClasses),
    style(`${isLast ? plainStyle : styleWithBorder}`),
    on.click(() => {
      onDoneChange(index);
      bgColor.value =
        bgColor.value === "bg-light-yellow"
          ? "bg-light-transparent"
          : "bg-light-yellow";
    }),
    m.Span(classes(isDone ? "strike" : ""), innerText(task)),
    m.Button(
      classes(`mb1`),
      style(`display: inline-block;`),
      on.click((e) => {
        onDelete(index);
        e.stopPropagation();
      }),
      innerText("x")
    )
  );
};
