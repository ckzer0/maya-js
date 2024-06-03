// import { App } from "./examples/todo/app";
import { App } from "./examples/tic-tac-toe/app";

const runApp = () => {
  const app = App();
  // console.log(app.innerHTML);
  document.body.appendChild(app);
};

runApp();
