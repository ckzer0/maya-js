import { App } from "./view/app";

const withContext = (app, context) => {
  const updateContext = () => {};
  return app({ context, updateContext });
};

const runApp = () => {
  const context = {
    initialTodos: [
      { id: 0, text: "saat baje hi uth gaye" },
      { id: 1, text: "nahana tha, parn nahaya nahi" },
      { id: 2, text: "khana thoos liya waise" },
    ],
  };

  const app = withContext(App, context);
  document.body.appendChild(app);
};

runApp();
