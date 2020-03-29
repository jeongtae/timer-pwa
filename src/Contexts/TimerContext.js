import createContext from "./createContext";

const LocalStorage = {
  get(key, fallback = null) {
    try {
      const json = window.localStorage.getItem(key);
      if (json == null) {
        return fallback;
      }
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      const json = JSON.stringify(value);
      window.localStorage.setItem(key, json);
      return true;
    } catch {
      return false;
    }
  }
};

const LS_TIME = "timerTime";
function saveTime(seconds) {
  LocalStorage.set(LS_TIME, seconds);
}
function loadTime() {
  return LocalStorage.get(LS_TIME, 330);
}

let loopId = 0;
let addedLeft = 0;
export const { useContext: useTimerContext, ContextProvider: TimerProvider } = createContext(
  {
    // states
    total: loadTime(),
    left: loadTime(),
    elapsed: 0,
    addedLeft: 0,
    state: "stop"
  },
  {
    // actions
    setTimerHours(states, hours) {
      const { state, total, setMultiple } = states;
      if (state === "stop") {
        const newTotal = (total % 3600) + hours * 3600;
        setMultiple({ total: newTotal, left: newTotal, elapsed: 0 });
        saveTime(newTotal);
      }
    },
    setTimerMinutes(states, minutes) {
      const { state, total, setMultiple } = states;
      if (state === "stop") {
        const newTotal = total - (total % 3600) + minutes * 60 + (total % 60);
        setMultiple({ total: newTotal, left: newTotal, elapsed: 0 });
        saveTime(newTotal);
      }
    },
    setTimerSeconds(states, seconds) {
      const { state, total, setMultiple } = states;
      if (state === "stop") {
        const newTotal = total - (total % 60) + seconds;
        setMultiple({ total: newTotal, left: newTotal, elapsed: 0 });
        saveTime(newTotal);
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
        setMultiple({
          state: newLeft <= 0 ? "done" : "running",
          left: newLeft,
          elapsed: newElapsed,
          addedLeft
        });
      }, 10);
    },
    pauseTimer(states) {
      const { setState, left, total } = states;
      setState(left === total ? "stop" : "pause");
      clearInterval(loopId);
      loopId = 0;
    },
    resetTimer(states) {
      const { setMultiple, total } = states;
      setMultiple({ state: "stop", left: total, elapsed: 0, addedLeft: 0 });
      clearInterval(loopId);
      loopId = 0;
      addedLeft = 0;
    }
  }
);
