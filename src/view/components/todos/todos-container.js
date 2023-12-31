import { MAYA, Mutate } from "../../../../lib/maya";
import { Dispatch } from "../../../../lib/store";
import { Header } from "../header";
import { TodoTile } from "./todo-tile";

export const Todos = (firstRenderprops) => {
  const { title, todos } = firstRenderprops;
  let todosContainer;
  const baseCss = "pl5 pr5 m2 bcol-lgrey rad10";
  const paddingCss = "pt2 pb2";

  const firstRender = MAYA.Div({
    classNames: "border2-light rad15",
    children: [
      Header({ title }),
      (todosContainer = MAYA.Ul({
        children: todos.map((task, i) => TodoTile({ task, isLast: i === todos.length - 1 })),
        classNames: `${baseCss} ${paddingCss}`,
      })),
    ],
  });

  Mutate(todosContainer.mayaId, "DELETE_TODO_TILE", (todoTile) => {
    console.log(`removing todo tile whose id is: ${todoTile.mayaId}`);
    todosContainer.removeChild(todoTile);

    if(!todosContainer.childNodes.length){
      todosContainer.setAttribute("class", `${baseCss}`);
    }
  });

  Mutate(todosContainer.mayaId, "ADD_TODO_TILE", (task) => {
    console.log(task);
    if(!todosContainer.childNodes.length){
      todosContainer.setAttribute("class", `${baseCss} ${paddingCss}`);
    }
    todosContainer.appendChild(TodoTile({ task, isLast: true }));
  });

  return firstRender;
};
