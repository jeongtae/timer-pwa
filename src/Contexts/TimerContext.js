// import React, { createContext, useState, useContext } from "react";
import createContext from "./createContext";

let loopId = 0;
let loopDestTime = 0;

export const { useContext: useTimerContext, ContextProvider: TimerProvider } = createContext(
  {
    // states
    total: 8562,
    left: 10,
    progress: 0,
    state: "stop",
    destTime: 0
  },
  {
    // actions
    setTimerHours(states, hours) {
      const { total, setTotal, setLeft } = states;
      const newTotal = (total % 3600) + hours * 3600;
      setTotal(newTotal);
      setLeft(newTotal);
    },
    setTimerMinutes(states, minutes) {
      const { total, setTotal, setLeft } = states;
      const newTotal = total - (total % 3600) + minutes * 60 + (total % 60);
      setTotal(newTotal);
      setLeft(newTotal);
    },
    setTimerSeconds(states, seconds) {
      const { total, setTotal, setLeft } = states;
      const newTotal = total - (total % 60) + seconds;
      setTotal(newTotal);
      setLeft(newTotal);
    },
    delayTimer(states, seconds) {
      loopDestTime += seconds * 1000;
    },
    startTimer(states) {
      const { state, setState, setDestTime, left, total, setMultiple } = states;
      // change current state
      setState("running");
      // set destination time
      const destTime = Date.now() + 1000 * (state !== "done" ? left : total);
      setDestTime(destTime);
      loopDestTime = destTime;
      // start loop
      const progressUpdatesPerSec = Math.max(Math.min(Math.floor(60 / (total / 2)), 30), 1);
      clearInterval(loopId);
      loopId = setInterval(() => {
        const newLeft = Math.ceil((loopDestTime - Date.now()) / 1000);
        const newProgress = Math.min(
          1,
          1 -
            Math.ceil(((loopDestTime - Date.now()) / 1000) * progressUpdatesPerSec) /
              (total * progressUpdatesPerSec)
        );
        if (newLeft <= 0 && state !== "done") {
          setMultiple({
            destTime: loopDestTime,
            state: "done",
            left: newLeft,
            progress: newProgress
          });
        } else {
          console.log(loopDestTime);
          setMultiple({
            // state: "running",
            destTime: loopDestTime,
            left: newLeft,
            progress: newProgress
          });
        }
      }, 10);
    },
    pauseTimer(states) {
      const { setState, left, total, setDestTime } = states;
      // change current state
      setState(left === total ? "stop" : "pause");
      // forget destination time
      setDestTime(0);
      loopDestTime = 0;
      // stop loop
      clearInterval(loopId);
      loopId = 0;
    },
    resetTimer(states) {
      const { setState, setLeft, total, setDestTime } = states;
      setState("stop");
      setLeft(total);
      setDestTime(0);
      loopDestTime = 0;
      clearInterval(loopId);
    }
  }
);
