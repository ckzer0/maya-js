import { classes, m, attribs, unfold } from "../../../lib";
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

  return m.Div(
    classes(`border2-light rad15 ${classNames}`),
    Header({ title }),
    m.Ul(
      classes(`${baseCss} ${paddingCss}`),
      unfold.map(tasks, (task, i) =>
        TodoTile({
          task: task.text,
          index: i,
          isDone: task.isDone,
          onDoneChange,
          onDelete,
          isLast: i === tasks().length - 1,
        })
      )
    )
  );
};
