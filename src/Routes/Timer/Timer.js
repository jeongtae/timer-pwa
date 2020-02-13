import React from "react";
import styles from "./Timer.module.scss";
import { useTimerContext } from "Contexts";

export default function() {
  const { state, startTimer, pauseTimer, resetTimer } = useTimerContext();

  // Click event handler
  const onClickStart = e => {
    if (state === "start") {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  // Click event handler
  const onClickReset = e => {
    resetTimer();
  };

  return (
    <div className={styles.container}>
      <header>Timer</header>
      <main>
        <span />
        <button onClick={onClickStart}>
          {state === "stop" ? "Start" : state === "start" ? "Pause" : "Continue"}
        </button>
        <button onClick={onClickReset} disabled={state === "stop"}>
          Reset
        </button>
      </main>
    </div>
  );
}
