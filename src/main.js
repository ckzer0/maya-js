import { App } from "./view/app";

const runApp = () => {
  const initialTodos = [
    "saat baje hi uth gaye",
    "nahana tha, parn nahaya nahi",
    "khana thoos liya waise",
    "ab kabhi nahi kochenge",
  ];
  document.body.appendChild(App({ todos: initialTodos }));
};

runApp();
