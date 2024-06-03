import {
  classes,
  cssClass,
  from,
  innerText,
  m,
  on,
  signal,
  style,
  use,
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
  const tileClasses = from(bgColor).getSignal(
    () => `mt1 pa2 pointer ${isDone ? bgColor() + " red" : ""}`
  );

  return m.Div(
    classes(tileClasses),
    style(`${isLast ? plainStyle : styleWithBorder}`),
    on.click(() => {
      bgColor.set("bg-light-yellow");
      onDoneChange(index);
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
