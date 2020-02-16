import React, {
  createContext as createReactContext,
  useContext as useReactContext,
  useState
} from "react";

export default function(states, actions) {
  const givenStates = { ...states };
  const givenActions = { ...actions };

  // create Context and result hook
  const reactContext = createReactContext();
  const useContext = () => useReactContext(reactContext);

  // replace actions
  const replacedActions = {};
  let replacedStates = {};
  Object.entries(givenActions).forEach(([actionName, action]) => {
    replacedActions[actionName] = (...params) => {
      action(replacedStates, ...params);
    };
  });

  // get Provider and result provider
  const ReactProvider = reactContext.Provider;
  const ContextProvider = ({ children }) => {
    const [states, setStates] = useState(givenStates);

    // replace states
    replacedStates = { ...states }; // change states reference for actions
    for (const key in states) {
      // add setter
      replacedStates[`set${key.charAt(0).toUpperCase()}${key.slice(1)}`] = param => {
        const oldState = states[key];
        const newState = typeof param === "function" ? param(oldState) : param;
        if (oldState !== newState) {
          setStates({ ...states, [key]: newState });
          states[key] = newState;
        }
      };
    }
    // add setter that changes multiple states at once
    replacedStates.setMultiple = param => {
      const oldStates = states;
      const statesToSet = typeof param === "function" ? param(oldStates) : param;
      // compare with old states
      let isDiffer = false;
      for (const key in statesToSet) {
        if (key in oldStates && statesToSet[key] !== oldStates[key]) {
          isDiffer = true;
          break;
        }
      }
      // if it is different
      if (isDiffer) {
        setStates({ ...oldStates, ...statesToSet });
        for (const key in statesToSet) {
          states[key] = statesToSet[key];
        }
      }
    };

    return (
      <ReactProvider value={{ states: states, actions: replacedActions }}>{children}</ReactProvider>
    );
  };

  // Return useContext function and ContextProvider component
  return { useContext, ContextProvider };
}
