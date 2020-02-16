import React from "react";
import styles from "./Timer.module.scss";
import { useTimerContext } from "Contexts";

export default function() {
  const Timer = () => {
    const {
      states: { left }
    } = useTimerContext();

    return <span>{left}</span>;
  };

  const StartButton = () => {
    const {
      states: { state },
      actions: { startTimer, pauseTimer }
    } = useTimerContext();

    const texts = { stop: "Start", running: "Pause", pause: "Continue", done: "Restart" };
    const onClick = () => {
      if (state === "running") {
        pauseTimer();
      } else {
        startTimer();
      }
    };

    return <button onClick={onClick}>{texts[state]}</button>;
  };

  const ResetButton = () => {
    const {
      states: { state },
      actions: { resetTimer }
    } = useTimerContext();

    const disabled = state === "stop";
    const onClick = () => {
      resetTimer();
    };

    return (
      <button onClick={onClick} disabled={disabled}>
        Reset
      </button>
    );
  };

  return (
    <div className={styles.container}>
      <header>Timer</header>
      <main>
        <Timer />
        <StartButton />
        <ResetButton />
      </main>
    </div>
  );
}
