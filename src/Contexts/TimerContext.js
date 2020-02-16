import React, { createContext, useState, useContext } from "react";
//import {usePrevious} from "Hooks"

let loopId = 0;
let destTime = 0;

const context = createContext();
export const useTimerContext = () => useContext(context);

const Provider = context.Provider;
export const TimerProvider = ({ children }) => {
  const states = {
    total: useState(5),
    left: useState(5),
    state: useState("stop")
  };

  const actions = {
    setTimer(seconds) {
      const { setTotal } = states;
      setTotal(seconds);
    },
    startTimer() {
      const { state, setState, left, setLeft, total } = states;
      // change current state
      setState("running");
      // set destination time
      destTime = Date.now() + 1000 * (state !== "done" ? left : total);
      // start loop
      clearInterval(loopId);
      loopId = setInterval(() => {
        const newLeft = Math.ceil((destTime - Date.now()) / 1000);
        if (newLeft === 0 && state !== "done") {
          setState("done");
        }
        setLeft(newLeft);
      }, 10);
    },
    pauseTimer() {
      const { setState, left, total } = states;
      // change current state
      setState(left === total ? "stop" : "pause");
      // forget destination time
      destTime = 0;
      // stop loop
      clearInterval(loopId);
      loopId = 0;
    },
    resetTimer() {
      const { setState, setLeft, total } = states;
      setState("stop");
      setLeft(total);
      clearInterval(loopId);
    }
  };

  Object.entries(states).forEach(([stateName, [state, setState]]) => {
    states[stateName] = state;
    states[`set${stateName.charAt(0).toUpperCase()}${stateName.slice(1)}`] = setState;
  });

  return <Provider value={{ states, actions }}>{children}</Provider>;
};
