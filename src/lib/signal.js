import { areArraysEqual, diffArrays } from "./diff";

let signalIdCounter = 0;
let consumerIdCounter = 0;
let historyPushCounter = 0;

const getFrozenValue = (newValue) => {
  let frozenValue;
  if (newValue?.mayaId) return newValue;

  if (typeof newValue === "object" && newValue !== null) {
    Object.freeze(newValue);
    if (Array.isArray(newValue)) frozenValue = newValue.map((v) => v);
    else frozenValue = { ...newValue };
  }
  return frozenValue;
};

export const signal = (initial) => {
  console.log(`initial value is: `);
  console.log(initial);
  let value = getFrozenValue(initial);
  const listenerCallbacks = [];
  const listenerDomNodes = [];
  const id = ++signalIdCounter;

  const valueGetter = () => value;

  valueGetter.type = "signal";
  valueGetter.id = id;

  valueGetter.set = (newValue, signalUpdaterMessage) => {
    console.log("signalUpdaterMessage");
    console.log(signalUpdaterMessage);
    const oldValue = valueGetter();
    console.log(oldValue);
    console.log(`is old and new value same: ${oldValue === newValue}`);
    console.log(`pushing to history ${++historyPushCounter} times`);
    value = getFrozenValue(newValue);
    console.log(value);
    listenerCallbacks.forEach((cb) => {
      console.log(cb);
      cb.callback(oldValue, signalUpdaterMessage);
    });
    notifyListenerDomNodes(oldValue, signalUpdaterMessage);
  };

  valueGetter.addListenerCallback = (id, callback) => {
    console.log(id);
    console.log(callback);
    const isExistingSignal = listenerCallbacks.some((cb) => cb.id === id);
    if (!isExistingSignal)
      listenerCallbacks.push({
        id,
        callback,
      });
  };

  const notifyListenerCallbacks = (oldValue, signalUpdaterMessage) => {
    listenerCallbacks.forEach((cb) => {
      cb.callback(oldValue, signalUpdaterMessage);
    });
  };

  valueGetter.removeListenerCallback = (id) => {
    listenerCallbacks = listenerCallbacks.filter((cb) => cb.id !== id);
  };

  valueGetter.addListenerDomNode = (mayaNode) => {
    const isExistingDomNode = listenerDomNodes.some(
      (node) => node.isEqualNode(mayaNode) && node.mayaId === mayaNode.mayaId
    );
    if (!isExistingDomNode) listenerDomNodes.push(mayaNode);
  };

  const notifyListenerDomNodes = (oldValue, signalUpdaterMessage) => {
    listenerDomNodes.forEach((node) => {
      const deadNodes = [];
      if (document.body.contains(node)) {
        node.dispatchEvent(
          new CustomEvent("signalChange", {
            detail: { signalId: id, oldValue, signalUpdaterMessage },
          })
        );
      } else {
        deadNodes.push(node);
        console.log(deadNodes);
      }

      deadNodes.forEach(removeListenerDomNode);
    });
  };

  const removeListenerDomNode = (deadNode) => {
    listenerDomNodes = listenerDomNodes.filter((node) => {
      const isDeadNode =
        node.isEqualNode(deadNode) && node.mayaId === deadNode.mayaId;
      return !isDeadNode;
    });
  };

  return valueGetter;
};

export const from = (...masterSignals) => {
  // TODO: Write tests to check whether this Garbage Collector works or not
  const getLsitenerGC = (consumerId) =>
    new FinalizationRegistry((heldValue) => {
      console.log(`${heldValue} was garbage collected`);
      masterSignals.forEach((signal) => {
        signal.removeListenerCallbacks(consumerId);
      });
    });

  const listener = {
    getSignal: (valueGetter) => {
      let consumerId;
      const consumerSignal = signal(valueGetter());
      const onMasterSignalChange = (oldSignalValue) => {
        consumerSignal.set(valueGetter(oldSignalValue));
      };

      masterSignals.forEach((signal) => {
        consumerId = ++consumerIdCounter;
        signal.addListenerCallback(consumerId, onMasterSignalChange);
      });

      setTimeout(() => {
        const listenerGC = getLsitenerGC(consumerId);
        listenerGC.register(listener);
      }, 0);

      return consumerSignal;
    },
  };

  return listener;
};

export const fromArraySignal = (masterArraySignal) => {
  const getLsitenerGC = (consumerId) =>
    new FinalizationRegistry((heldValue) => {
      console.log(`${heldValue} was garbage collected`);
      masterArraySignal.removeListenerCallbacks(consumerId);
    });

  const listener = {
    getSingalsList: (converter) => {
      if (!Array.isArray(masterArraySignal())) {
        throw new Error("argument should be a signal of array");
      }

      const consumerSignals = [];
      const onMasterSignalChange = (oldArrayValue, signalUpdaterMessage) => {
        console.log(oldArrayValue);
        const isEqual = areArraysEqual(oldArrayValue, masterArraySignal());
        // if (isEqual) {
        //   console.log(oldArrayValue, masterArraySignal());
        //   console.error("Array signal is updated with same value again.");
        //   return;
        // }
        if (oldArrayValue.length === masterArraySignal().length) {
          const diffIndices = diffArrays(oldArrayValue, masterArraySignal());
          console.log(oldArrayValue);
          console.log(masterArraySignal());
          diffIndices.forEach((index) => {
            const signalItems = masterArraySignal();
            console.log(index);
            console.log(consumerSignals);
            console.log(consumerSignals[index]);
            console.log(consumerSignals[index].set);
            consumerSignals[index].set(converter(signalItems[index], index), {
              childIndex: index,
            });
          });
        }
        // TODO: complext array calculation
      };
      const consumerId = consumerIdCounter++;
      masterArraySignal.addListenerCallback(consumerId, onMasterSignalChange);
      const listenerGC = getLsitenerGC(consumerId);
      listenerGC.register(listener);

      masterArraySignal().forEach((item, index) => {
        const itemSignal = signal(converter(item, index));
        consumerSignals.push(itemSignal);
      });

      return consumerSignals;
    },
  };

  return listener;
};
