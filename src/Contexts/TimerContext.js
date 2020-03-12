import createContext from "./createContext";

let loopId = 0;
let addedLeft = 0;

export const { useContext: useTimerContext, ContextProvider: TimerProvider } = createContext(
  {
    // states
    total: 3661,
    left: 3661,
    elapsed: 0,
    state: "stop"
  },
  {
    // actions
    setTimerHours(states, hours) {
      const { state, total, setMultiple } = states;
      if (state === "stop") {
        const newTotal = (total % 3600) + hours * 3600;
        setMultiple({ total: newTotal, left: newTotal, elapsed: 0 });
      }
    },
    setTimerMinutes(states, minutes) {
      const { state, total, setMultiple } = states;
      if (state === "stop") {
        const newTotal = total - (total % 3600) + minutes * 60 + (total % 60);
        setMultiple({ total: newTotal, left: newTotal, elapsed: 0 });
      }
    },
    setTimerSeconds(states, seconds) {
      const { state, total, setMultiple } = states;
      if (state === "stop") {
        const newTotal = total - (total % 60) + seconds;
        setMultiple({ total: newTotal, left: newTotal, elapsed: 0 });
      }
    },
    addLeft(states, seconds) {
      addedLeft += seconds;
    },
    startTimer(states) {
      const { state, setState, left, total, setMultiple } = states;
      let seconds;
      if (state === "pause") {
        seconds = left - addedLeft;
      } else {
        // stop or done
        seconds = total;
        addedLeft = 0;
      }
      setState("running");
      const endTime = Date.now() + 1000 * seconds;
      clearInterval(loopId);
      loopId = setInterval(() => {
        const newLeft = Math.ceil((endTime + addedLeft * 1000 - Date.now()) / 1000);
        const newElapsed = total + addedLeft - newLeft;
        const newState = newLeft <= 0 ? "done" : "running";
        setMultiple({
          state: newState,
          left: newLeft,
          elapsed: newElapsed
        });
      }, 10);
    },
    pauseTimer(states) {
      const { setState, left, total } = states;
      setState(left === total ? "stop" : "pause");
      clearInterval(loopId);
      loopId = 0;
      addedLeft = 0;
    },
    resetTimer(states) {
      const { setMultiple, total } = states;
      setMultiple({ state: "stop", left: total, elapsed: 0 });
      clearInterval(loopId);
      loopId = 0;
      addedLeft = 0;
    }
  }
);
