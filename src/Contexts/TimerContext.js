// import React, { createContext, useState, useContext } from "react";
import createContext from "./createContext";

let loopId = 0;
let endTime = 0;

export const { useContext: useTimerContext, ContextProvider: TimerProvider } = createContext(
  {
    // states
    total: 3661,
    left: 0,
    elapsed: 0,
    state: "stop"
  },
  {
    // actions
    setTimerHours(states, hours) {
      const { total, setMultiple } = states;
      const newTotal = (total % 3600) + hours * 3600;
      setMultiple({ total: newTotal, left: newTotal });
    },
    setTimerMinutes(states, minutes) {
      const { total, setMultiple } = states;
      const newTotal = total - (total % 3600) + minutes * 60 + (total % 60);
      setMultiple({ total: newTotal, left: newTotal });
    },
    setTimerSeconds(states, seconds) {
      const { total, setMultiple } = states;
      const newTotal = total - (total % 60) + seconds;
      setMultiple({ total: newTotal, left: newTotal });
    },
    addLeft(states, seconds) {
      endTime += seconds * 1000;
    },
    startTimer(states) {
      const { state, setState, left, total, setMultiple } = states;
      setState("running");
      endTime = Date.now() + 1000 * (state === "pause" ? left : total);
      clearInterval(loopId);
      loopId = setInterval(() => {
        const newLeft = Math.ceil((endTime - Date.now()) / 1000);
        if (newLeft <= 0 && state !== "done") {
          setMultiple({
            state: "done",
            left: newLeft
          });
        } else {
          setMultiple({
            // state: "running",
            left: newLeft
          });
        }
      }, 10);
    },
    pauseTimer(states) {
      const { setState, left, total } = states;
      setState(left === total ? "stop" : "pause");
      endTime = 0;
      clearInterval(loopId);
      loopId = 0;
    },
    resetTimer(states) {
      const { setState, setLeft, total } = states;
      setState("stop");
      setLeft(total);
      endTime = 0;
      clearInterval(loopId);
      loopId = 0;
    }
  }
);
