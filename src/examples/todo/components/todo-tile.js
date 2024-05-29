import { m } from "../../../lib";

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

  return m.Div({
    classNames: `mt2 pb2 pointer`,
    style: ` ${isLast ? plainStyle : styleWithBorder}`,
    onclick: () => {
      onDoneChange(index);
    },
    children: [
      isDone
        ? m.S({
            children: task,
          })
        : m.Span({
            children: task,
          }),
      m.Button({
        children: "x",
        style: "display: inline-block;",
        onclick: (e) => {
          onDelete(index);
          e.stopPropagation();
        },
      }),
    ],
  });
};
