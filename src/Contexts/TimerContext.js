import React, { createContext, useState, useContext } from "react";

const Context = createContext();

const TimerProvider = ({ children }) => {
  const [state, setState] = useState({
    timeDuration: 30,
    timeLeft: 30,

    state: "stop", // "running", "pause", "done"

    startTimer() {
      setState({
        ...state,
        state: "start"
      });
    },
    pauseTimer() {
      setState({
        ...state,
        state: "pause"
      });
    },
    resetTimer() {
      setState({
        ...state,
        state: "stop",
        timeLeft: state.timeDuration
      });
    }
  });
  return <Context.Provider value={state}>{children}</Context.Provider>;
};

const useTimerContext = () => useContext(Context);

export { TimerProvider, useTimerContext };
