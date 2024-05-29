import { m } from "../../../lib";
import { Header } from "../../../elements";
import { TodoTile } from "./todo-tile";

export const Todos = ({ classNames, title, tasks }) => {
  const baseCss = "pl5 pr5 m2 bcol-lgrey rad10";
  const paddingCss = "pt2 pb2";

  const onDelete = (tileIndex) => {
    tasks.set(tasks().filter((_, i) => i !== tileIndex));
  };

  const onDoneChange = (tileIndex) => {
    const updatedTasks = tasks().map((task, i) => {
      if (i === tileIndex) {
        return { ...task, isDone: !task.isDone };
      }
      return task;
    });
    tasks.set(updatedTasks);
  };

  return m.Div({
    classNames: `border2-light rad15 ${classNames}`,
    children: [
      Header({ title }),
      m.Ul({
        classNames: `${baseCss} ${paddingCss}`,
        children: [
          tasks,
          (sigValue) => {
            return sigValue.map((task, i) => {
              return TodoTile({
                task: task.text,
                index: i,
                isLast: i === tasks().length - 1,
                isDone: task.isDone,
                onDoneChange,
                onDelete,
              });
            });
          },
        ],
      }),
    ],
  });
};
