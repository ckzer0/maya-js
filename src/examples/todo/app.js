import { m, signal } from "../../lib";
import { Button, Header, TextBox } from "../../elements";
import { Todos } from "./components";

export const App = () => {
  const searchText = signal("");
  const tasks = signal([
    { text: "saat baje hi uth gaye", isDone: false },
    { text: "nahana tha, parn nahaya nahi", isDone: false },
    { text: "khana thoos liya waise", isDone: false },
    { text: "ab kabhi nahi kochenge", isDone: false },
  ]);

  const addTodo = () => {
    tasks.set([...tasks(), { text: searchText(), isDone: false }]);
    searchText.set("");
  };

  return m.Div({
    children: [
      Header({ title: "Todo App", variant: "large" }),
      m.Div({
        classNames: "mb2",
        children: [
          TextBox({
            classNames: "m3",
            value: searchText,
            onkeypress: (keyEvent) => {
              if (keyEvent.key === "Enter") addTodo();
              else searchText.set(keyEvent.target.value + keyEvent.key);
            },
          }),
          Button({
            label: "add todo",
            onclick: addTodo,
          }),
        ],
      }),
      Todos({
        classNames: "m3",
        title: "tasks list",
        tasks: tasks,
      }),
    ],
  });
};
