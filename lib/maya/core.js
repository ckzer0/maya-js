import { eventKeys } from "./constants";

window.prototypeAlteringDone = false;

if(!window.prototypeAlteringDone){
  const remover = Node.prototype.removeChild;
  Node.prototype.removeChild = function() {
    const context = this;
    const nodeId = arguments[0].mayaId;
    console.log(this.mayaId);
    console.log(nodeId);
    console.log(arguments[0].mayaId);
    remover.apply(context, arguments);
    removeMutationCallback(nodeId);
  }

  window.prototypeAlteringDone = true;
}

let elId = 0;
const getNewId = () => elId++;
const MutationsRegister = {};
const MutationCallbacks = {};

const removeMutationCallback = (nodeId) => {
  console.log(`removing callback of node id: ${nodeId}`);
  const nodeMutationKeys = MutationsRegister[nodeId];
  if(!nodeMutationKeys?.length) return;
  console.log(`mutation keys of node id ${nodeId} are: ${nodeMutationKeys}`);

  const callbacksCount = nodeMutationKeys.length;
  for(const [mutationKey, callbacks] of Object.entries(MutationCallbacks)){
    let totaleDeleted = 0;
    if(nodeMutationKeys.includes(mutationKey)){
      MutationCallbacks[mutationKey] = callbacks.filter(cbObj => cbObj.nodeId !== nodeId);
      totaleDeleted += 1;
    }
    if(totaleDeleted == callbacksCount) {
      delete MutationsRegister[nodeId];
      break;
    }
  }
}

export const Mutations = {};

export const Mutate = (nodeId, mutationKey, callback) => {
  const callbackObject = { nodeId, callback };
  if(Array.isArray(MutationsRegister[nodeId])) {
    MutationsRegister[nodeId].push(mutationKey);
  } else {
    MutationsRegister[nodeId] = [ mutationKey ];
  }

  if(Array.isArray(MutationCallbacks[mutationKey])) {
    MutationCallbacks[mutationKey].push(callbackObject);
  } else {
    MutationCallbacks[mutationKey] = [ callbackObject ];
    Mutations[mutationKey] = (...args) => {
      MutationCallbacks[mutationKey].forEach(cbObject => {
        console.log(MutationsRegister);
        console.log(MutationCallbacks);
        console.log(`executing mutation of node id: ${cbObject.nodeId}`);
        cbObject.callback(...args);
      });
    };
  }
}

export const createEl = (tagName, props) => {
  const el = document.createElement(tagName);

  for (const [key, value] of Object.entries(props)) {
    if (eventKeys.includes(key) && typeof value === "function") {
      const eventKey = key.slice(2);
      el.addEventListener(eventKey, value);
    } else if (key === "children") {
      if (typeof value === "string") {
        el.innerText = value;
      }
      if (Array.isArray(value)) {
        value.forEach((child) => {
          el.appendChild(child);
        });
      }
    } else {
      const attrKey = key === "classNames" ? "class" : key;
      const attr = document.createAttribute(attrKey);
      attr.value = value;
      el.setAttributeNode(attr);
    }
  }

  el.mayaId = getNewId();
  // console.log(el.mayaId);
  // console.log(el.innerText);

  return el;
};
