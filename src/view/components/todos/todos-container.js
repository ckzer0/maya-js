import { MAYA } from "../../../../maya";
import { Header } from "../header";
import { TodoTile } from "./todo-tile";

export const Todos = ({ title, todos, onDelete }) => {
  let todosContainer;
  const addTodo = (text) =>
    todosContainer.appendChild(TodoTile({ todo: text }));

  return MAYA.Div({
    emitted: { addTodo },
    classNames: "border2-light rad15",
    children: [
      Header({ title }),
      (todosContainer = MAYA.Ul({
        children: todos.map((todo) => TodoTile({ todo, onDelete })),
        classNames: "pl5 pr5 pt2 pb2 m2 bcol-lgrey rad10",
      })),
    ],
  });
};
