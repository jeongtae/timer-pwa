import React from "react";
import styles from "./Timer.module.scss";
import { useTimerContext } from "Contexts";

export default function() {
  const Timer = () => {
    const {
      states: { state, left, total, progress }
    } = useTimerContext();
    const format = seconds => {
      const isNegative = seconds < 0;
      if (isNegative) {
        seconds = -seconds;
      }
      const [h, m, s] = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60];

      const ms = `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
      if (h > 0) {
        return `${isNegative ? "-" : ""}${h < 10 ? "0" : ""}${h}:${ms}`;
      } else {
        return `${isNegative ? "-" : ""}${ms}`;
      }
    };

    if (state === "stop") {
      return (
        <>
          <span>{format(total)}</span>
        </>
      );
    } else {
      const spanStyles = [];
      if (state === "done") spanStyles.push(styles.flash);
      if (left >= 3600) spanStyles.push(styles.small);
      return (
        <>
          <progress className={state === "done" ? styles.done : null} value={progress} />
          {/* <span className={state === "done" ? styles.flash : null}>{format(left)}</span> */}
          <span className={spanStyles.join(" ")}>{format(left)}</span>
        </>
      );
    }
  };

  const StartButton = () => {
    const {
      states: { state },
      actions: { startTimer, pauseTimer }
    } = useTimerContext();

    const texts = { stop: "Start", running: "Pause", pause: "Continue", done: "Restart" };
    const classes = {
      stop: styles.green,
      running: styles.orange,
      pause: styles.orange,
      done: styles.green
    };
    const onClick = () => {
      if (state === "running") {
        pauseTimer();
      } else {
        startTimer();
      }
    };

    return (
      <button onClick={onClick} className={classes[state]}>
        {texts[state]}
      </button>
    );
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
        <div>
          <ResetButton />
          <StartButton />
        </div>
      </main>
    </div>
  );
}
