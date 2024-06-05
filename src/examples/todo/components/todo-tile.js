import { m, signal } from "../../../lib";

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
  const getTitleClass = () =>
    `mt1 pa2 pointer ${!isDone ? bgColor.value + " dark-green" : ""}`;

  return m.Div({
    class: getTitleClass,
    style: `${isLast ? plainStyle : styleWithBorder}`,
    onclick: () => {
      onDoneChange(index);
      bgColor.value =
        bgColor.value === "bg-light-yellow"
          ? "bg-light-transparent"
          : "bg-light-yellow";
    },
    children: [
      m.Span({
        class: isDone ? "strike" : "",
        innerText: task,
      }),
      m.Button({
        class: `mb1`,
        style: `display: inline-block;`,
        onclick: (e) => {
          onDelete(index);
          e.stopPropagation();
        },
        innerText: "x",
      }),
    ],
  });
};
