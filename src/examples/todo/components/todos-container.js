import { Header } from "../../../elements";
import { derived } from "../../../lib/core";
import { classes, innerText, mDiv, mP, mUl } from "../../../lib/html";
import { TodoTile } from "./todo-tile";

export const Todos = ({ classNames, title, tasks }) => {
  const onDelete = (tileIndex) => {
    tasks.value = tasks.value.filter((_, i) => i !== tileIndex);
  };

  const onDoneChange = (tileIndex) => {
    const updatedTasks = [...tasks.value];
    updatedTasks[tileIndex].isDone = !tasks.value[tileIndex].isDone;
    tasks.value = updatedTasks;
  };

  return mDiv(
    classes(`border2-light rad15 ${classNames}`),
    Header({ title }),
    mDiv(
      classes(`pa3 m2 bcol-lgrey rad10`),
      derived(() =>
        mUl(
          classes("list pa1 ma0"),
          ...tasks.value.map((task, i) =>
            TodoTile({
              task: task.text,
              index: i,
              isDone: task.isDone,
              onDoneChange,
              onDelete,
              isLast: i === tasks.value.length - 1,
            })
          )
        )
      ),
      mP(
        classes("pr3 flex items-center justify-center"),
        innerText("----- end of tasks -----")
      )
    )
  );
};
