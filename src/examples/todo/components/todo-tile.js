import { classes, innerText, m, on, signal, style } from "../../../lib";

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
  const tapped = signal(false);

  return m.Div(
    classes([
      tapped,
      (isTapped) =>
        `mt2 pb2 pointer ${isTapped ? "bg-yellow" : "bg-transparent"}`,
    ]),
    style(`${isLast ? plainStyle : styleWithBorder}`),
    on.click(() => {
      tapped.set(!tapped());
      onDoneChange(index);
    }),
    isDone ? m.S(innerText(task)) : m.Span(innerText(task)),
    m.Button(
      style(`display: inline-block;`),
      on.click((e) => {
        onDelete(index);
        e.stopPropagation();
      }),
      innerText("x")
    )
  );
};
