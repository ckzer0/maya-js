import { Button, Header, TextBox } from "../../elements";
import { derived, signal } from "../../lib/core";
import { classes, mDiv } from "../../lib/html";
import { Todos } from "./components";

export const App = () => {
  const searchText = signal("");
  const tasks = signal([
    { text: "saat baje hi uth gaye", isDone: false },
    { text: "nahana tha, parn nahaya nahi", isDone: false },
    { text: "khana thoos liya waise", isDone: false },
    { text: "ab kabhi nahi kochenge", isDone: false },
  ]);
  const tasksTitle = derived(() => `total taks: ${tasks.value.length}`);

  const addTodo = () => {
    if (searchText.value)
      tasks.value = [...tasks.value, { text: searchText.value, isDone: false }];
    searchText.value = "";
  };

  return mDiv(
    classes("ph3"),
    Header({ title: "Todo App", variant: "large" }),
    mDiv(
      classes("mb2"),
      TextBox({
        classNames: "mb2 mr3",
        value: searchText,
        onkeypress: (keyEvent) => {
          if (keyEvent.key === "Enter") addTodo();
          else searchText.value = keyEvent.target.value + keyEvent.key;
        },
      }),
      Button({ onTap: addTodo, label: "add todo" })
    ),
    Todos({ classNames: "mb3", title: tasksTitle, tasks })
  );
};
