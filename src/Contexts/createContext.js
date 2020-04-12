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

  // wrap actions
  const wrappedActions = {};
  let statesForAction = {};
  Object.entries(givenActions).forEach(([actionName, action]) => {
    wrappedActions[actionName] = (...params) => {
      action(statesForAction, ...params);
    };
  });

  // get Provider and result provider
  const ReactProvider = reactContext.Provider;
  const ContextProvider = ({ children }) => {
    const [states, setStates] = useState(givenStates);

    // add state setters
    statesForAction = { ...states }; // change states reference for actions
    for (const stateName in states) {
      // add setter for each states
      const capitalizedName = `${stateName.charAt(0).toUpperCase()}${stateName.slice(1)}`;
      // eslint-disable-next-line
      statesForAction[`set${capitalizedName}`] = param => {
        const oldState = states[stateName];
        const newState = typeof param === "function" ? param(oldState) : param;
        if (oldState !== newState) {
          setStates({ ...states, [stateName]: newState });
          states[stateName] = newState;
          statesForAction[stateName] = newState;
        }
      };
    }
    // add setter that changes multiple states at once
    statesForAction.setMultiple = param => {
      const oldStates = states;
      const statesToSet = typeof param === "function" ? param(oldStates) : param;
      // compare with old states
      let isDiffer = false;
      for (const stateName in statesToSet) {
        if (stateName in oldStates && statesToSet[stateName] !== oldStates[stateName]) {
          isDiffer = true;
          break;
        }
      }
      // if it is different
      if (isDiffer) {
        setStates({ ...oldStates, ...statesToSet });
        for (const stateName in statesToSet) {
          states[stateName] = statesToSet[stateName];
          statesForAction[stateName] = statesToSet[stateName];
        }
      }
    };

    return (
      <ReactProvider value={{ states: states, actions: wrappedActions }}>{children}</ReactProvider>
    );
  };

  // Return useContext function and ContextProvider component
  return { useContext, ContextProvider };
}
