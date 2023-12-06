import { MAYA } from "../../maya";
import { Button, TextBox, Todos } from "./components";

export const App = ({ context, updateContext }) => {
  let textbox;
  let addTodo;

  const state = {
    textBoxText: "",
  };

  const onTodoDelete = (id) => {
    const newTodos = context.initialTodos.filter((todo) => todo.id !== id);
    const updatedContext = {
      ...context,
      initialTodos: newTodos,
    };
    updateContext(updatedContext);
    console.log(context.initialTodos);
  };

  const onTextChange = (e) => {
    if (e.key === "Enter") {
      addTodoTask();
      return;
    }

    state.textBoxText = e.target.value;
  };

  const addTodoTask = () => {
    addTodo(state.textBoxText);
    textbox.value = "";
  };

  return MAYA.Div({
    children: [
      MAYA.Div({
        classNames: "mb2",
        children: [
          (textbox = TextBox({
            onkeypress: onTextChange,
          })),
          Button({
            label: "add todo",
            onclick: addTodoTask,
          }),
        ],
      }),
      ({
        emitted: { addTodo },
      } = Todos({
        title: "Your todos list",
        todos: context.initialTodos,
        onDelete: onTodoDelete,
      })),
    ],
  });
};
