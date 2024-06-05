let subscriber = null;

export const signal = (value) => {
  const subscriptions = new Set();

  return {
    type: "signal",
    get value() {
      if (subscriber) subscriptions.add(subscriber);
      return value;
    },
    set value(newValue) {
      value = newValue;
      subscriptions.forEach((callback) => callback());
    },
  };
};

export const effect = (fn) => {
  subscriber = fn;
  fn();
  subscriber = null;
};

export const derived = (fn) => {
  const derivedSignal = signal();
  effect(() => {
    derivedSignal.value = fn();
  });

  return derivedSignal;
};

export const valueIsSignal = (value) => !!(value?.type === "signal");
