// import React, { createContext, useState, useContext } from "react";
import createContext from "./createContext";

let loopId = 0;
let destTime = 0;

export const { useContext: useTimerContext, ContextProvider: TimerProvider } = createContext(
  {
    // states
    total: 5,
    left: 5,
    state: "stop"
  },
  {
    // actions
    setTimer(states, seconds) {
      const { setTotal } = states;
      setTotal(seconds);
    },
    startTimer(states) {
      const { state, setState, left, setLeft, total, setMultiple } = states;
      // change current state
      setState("running");
      // set destination time
      destTime = Date.now() + 1000 * (state !== "done" ? left : total);
      // start loop
      clearInterval(loopId);
      loopId = setInterval(() => {
        const newLeft = Math.ceil((destTime - Date.now()) / 1000);
        if (newLeft === 0 && state !== "done") {
          setMultiple({ state: "done", left: newLeft });
          // setState("done");
          // setLeft(newLeft);
        } else {
          setLeft(newLeft);
        }
      }, 10);
    },
    pauseTimer(states) {
      const { setState, left, total } = states;
      // change current state
      setState(left === total ? "stop" : "pause");
      // forget destination time
      destTime = 0;
      // stop loop
      clearInterval(loopId);
      loopId = 0;
    },
    resetTimer(states) {
      const { setState, setLeft, total } = states;
      setState("stop");
      setLeft(total);
      clearInterval(loopId);
    }
  }
);
