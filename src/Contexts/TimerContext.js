// import React, { createContext, useState, useContext } from "react";
import createContext from "./createContext";

let loopId = 0;
let destTime = 0;

export const { useContext: useTimerContext, ContextProvider: TimerProvider } = createContext(
  {
    // states
    total: 10,
    left: 10,
    progress: 0,
    state: "stop"
  },
  {
    // actions
    setTimer(states, seconds) {
      const { setTotal } = states;
      setTotal(seconds);
    },
    startTimer(states) {
      const { state, setState, left, total, setMultiple } = states;
      // change current state
      setState("running");
      // set destination time
      destTime = Date.now() + 1000 * (state !== "done" ? left : total);
      // start loop
      const progressUpdatesPerSec = Math.max(Math.min(Math.floor(60 / (total / 2)), 30), 1);
      clearInterval(loopId);
      loopId = setInterval(() => {
        const newLeft = Math.ceil((destTime - Date.now()) / 1000);
        const newProgress = Math.min(
          1,
          1 -
            Math.ceil(((destTime - Date.now()) / 1000) * progressUpdatesPerSec) /
              (total * progressUpdatesPerSec)
        );
        if (newLeft === 0 && state !== "done") {
          setMultiple({ state: "done", left: newLeft, progress: newProgress });
          // setState("done");
          // setLeft(newLeft);
        } else {
          setMultiple({ left: newLeft, progress: newProgress });
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
