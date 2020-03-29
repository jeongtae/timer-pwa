import createContext from "./createContext";
import { LocalStorage } from "Utils";

const TimeStorage = (function IIFE() {
  const LS_KEY = "timerTime";
  return {
    save(seconds) {
      LocalStorage.set(LS_KEY, seconds);
    },
    load() {
      return LocalStorage.get(LS_KEY, 330);
    }
  };
})();

const RecentsStorage = (function IIFE() {
  const LS_KEY = "timerRecents";
  let loadCache = LocalStorage.get(LS_KEY, []);
  function save(recents) {
    loadCache = recents;
    LocalStorage.set(LS_KEY, recents);
  }
  return {
    load() {
      return loadCache;
    },
    saveOne(seconds) {
      const recents = this.load();
      const duplicatedIndex = recents.indexOf(seconds);
      if (duplicatedIndex >= 0) {
        recents.splice(duplicatedIndex, 1);
      }
      recents.splice(0, 0, seconds);
      save(recents);
    },
    deleteOne(seconds) {
      const recents = this.load();
      const deletingIndex = recents.indexOf(seconds);
      if (deletingIndex >= 0) {
        recents.splice(deletingIndex, 1);
        save(recents);
      }
    }
  };
})();

let loopId = 0;
let addedLeft = 0;
export const { useContext: useTimerContext, ContextProvider: TimerProvider } = createContext(
  {
    // states
    total: TimeStorage.load(),
    left: TimeStorage.load(),
    elapsed: 0,
    addedLeft: 0,
    state: "stop",
    recents: RecentsStorage.load()
  },
  {
    // actions
    setTimerHours(states, hours) {
      const { state, total, setMultiple } = states;
      if (state === "stop") {
        const newTotal = (total % 3600) + hours * 3600;
        setMultiple({ total: newTotal, left: newTotal, elapsed: 0 });
        TimeStorage.save(newTotal);
      }
    },
    setTimerMinutes(states, minutes) {
      const { state, total, setMultiple } = states;
      if (state === "stop") {
        const newTotal = total - (total % 3600) + minutes * 60 + (total % 60);
        setMultiple({ total: newTotal, left: newTotal, elapsed: 0 });
        TimeStorage.save(newTotal);
      }
    },
    setTimerSeconds(states, seconds) {
      const { state, total, setMultiple } = states;
      if (state === "stop") {
        const newTotal = total - (total % 60) + seconds;
        setMultiple({ total: newTotal, left: newTotal, elapsed: 0 });
        TimeStorage.save(newTotal);
      }
    },
    addLeft(states, seconds) {
      addedLeft += seconds;
    },
    startTimer(states) {
      const { state, setState, left, total, setMultiple, setRecents } = states;
      let seconds;
      if (state === "pause") {
        seconds = left - addedLeft;
      } else {
        // stop or done
        RecentsStorage.saveOne(total);
        setRecents([...RecentsStorage.load()]);
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
    },
    deleteRecent(states, seconds) {
      const { setRecents } = states;
      RecentsStorage.deleteOne(seconds);
      setRecents([...RecentsStorage.load()]);
    }
  }
);
