import { classes, m, attribs, unfold, cssClass, innerText } from "../../../lib";
import { Header } from "../../../elements";
import { TodoTile } from "./todo-tile";

export const Todos = ({ classNames, title, tasks }) => {
  const onDelete = (tileIndex) => {
    tasks.set(tasks().filter((_, i) => i !== tileIndex));
  };

  const onDoneChange = (tileIndex) => {
    console.log(`resding tasks: `);
    console.log(tasks.values);
    const updatedTasks = [];
    tasks().forEach((t, i) => {
      updatedTasks.push({
        ...t,
        isDone: i === tileIndex ? !t.isDone : t.isDone,
      });
    });
    // const updatedTasks = [...tasks()];
    // updatedTasks[tileIndex].isDone = !tasks()[tileIndex].isDone;
    console.log(tasks());
    console.log(updatedTasks);
    tasks.set(updatedTasks);
  };

  return m.Div(
    classes(`border2-light rad15 ${classNames}`),
    Header({ title }),
    m.Ul(
      classes(`pa3 m2 bcol-lgrey rad10`),
      unfold(tasks).map((task, i) =>
        TodoTile({
          task: task.text,
          index: i,
          isDone: task.isDone,
          onDoneChange,
          onDelete,
          isLast: i === tasks().length - 1,
        })
      ),
      m.P(
        classes("pr3 flex items-center justify-center"),
        innerText("----- end of tasks -----")
      )
    )
  );
};
