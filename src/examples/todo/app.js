import { Button, Header, TextBox } from "../../elements";
import { derived, m, signal } from "../../lib";
import { Todos } from "./components";

export const App = () => {
  const searchText = signal("");
  const tasks = signal([
    { text: "woke up @7 already", isDone: false },
    { text: "was about to bathe, but skipped it", isDone: false },
    { text: "devoured a lot of food", isDone: false },
    { text: "I swear, won't eat that much again", isDone: false },
  ]);
  const tasksTitle = derived(() => `total taks: ${tasks.value.length}`);

  const addTodo = () => {
    if (searchText.value)
      tasks.value = [...tasks.value, { text: searchText.value, isDone: false }];
    searchText.value = "";
  };

  return m.Div({
    class: "ph3",
    children: [
      Header({ title: "Todo App", variant: "large" }),
      m.Div({
        class: "mb2",
        children: [
          TextBox({
            classNames: "mb2 mr3",
            value: searchText,
            onkeypress: (keyEvent) => {
              if (keyEvent.key === "Enter") addTodo();
              else searchText.value = keyEvent.target.value + keyEvent.key;
            },
          }),
          Button({ onTap: addTodo, label: "add todo" }),
        ],
      }),
      Todos({ classNames: "mb3", title: tasksTitle, tasks }),
    ],
  });
};
