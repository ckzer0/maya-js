import { classes, m, on, attribs, signal } from "../../lib";
import { Button, Header, TextBox } from "../../elements";
import { Todos } from "./components";
import { testAboveMethods } from "../../lib/diff";

export const App = () => {
  const searchText = signal("");
  const tasks = signal([
    { text: "saat baje hi uth gaye", isDone: false },
    { text: "nahana tha, parn nahaya nahi", isDone: false },
    { text: "khana thoos liya waise", isDone: false },
    { text: "ab kabhi nahi kochenge", isDone: false },
  ]);
  const tasksTitle = signal(`total taks: ${tasks().length}`);

  const addTodo = () => {
    if (searchText())
      tasks.set([...tasks(), { text: searchText(), isDone: false }]);
    searchText.set("");
    tasksTitle.set(`total taks: ${tasks().length}`);
  };

  return m.Div(
    classes("ph3"),
    Header({ title: "Todo App", variant: "large" }),
    m.Div(
      classes("mb2"),
      TextBox({
        classNames: "mb2 mr3",
        value: searchText,
        onkeypress: (keyEvent) => {
          if (keyEvent.key === "Enter") addTodo();
          else searchText.set(keyEvent.target.value + keyEvent.key);
        },
      }),
      Button({ onclick: addTodo, label: "add todo" })
    ),
    Todos({ classNames: "mb3", title: tasksTitle, tasks })
  );
};
