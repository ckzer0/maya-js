let signalIdCounter = 0;

export class Signal {
  constructor(value) {
    this._value = value;
    this._subscribers = [];
    this.id = signalIdCounter++;
  }

  addSubscriber(mayaComp) {
    this._subscribers.push(mayaComp);
  }

  value(composer) {
    return composer ? composer(this._value) : this._value;
  }

  set(newValue) {
    console.log("setting new value", newValue);
    this._value = newValue;
    this._subscribers.forEach((comp) => {
      comp.dispatchEvent(
        new CustomEvent("signalChange", {
          detail: { signalId: this.id },
        })
      );
    });
  }
}

export const signal = (initial) => {
  const sig = new Signal(initial);
  const sigFn = (composer) => sig.value(composer);
  sigFn.type = "signal";
  sigFn.id = sig.id;
  sigFn.set = (newValue) => sig.set(newValue);
  sigFn.addSubscriber = (mayaComp) => sig.addSubscriber(mayaComp);

  return sigFn;
};
