import { MAYA } from "../../../../maya";

export const TodoTile = ({ todo, onDelete }) => {
  const deleteTodo = () => {
    onDelete(todo.id);
  };

  return MAYA.Div({
    classNames: "mt2 mb2 pb2",
    style:
      "display: flex; justify-content: space-between; border-bottom: 1px solid #ddd;",
    children: [
      MAYA.Span({
        children: todo.text,
      }),
      MAYA.Button({
        children: "x",
        style: "display: inline-block;",
        onclick: deleteTodo,
      }),
    ],
  });
};
