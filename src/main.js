import { App as LivingRoomApp } from "./examples/living-room/app";
import { App as TicTacToeApp } from "./examples/tic-tac-toe/app";
import { App as TodoApp } from "./examples/todo/app";

const runApp = () => {
  const apps = { LivingRoomApp, TicTacToeApp, TodoApp };
  document.body.appendChild(apps.TodoApp());
};

runApp();
