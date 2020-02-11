import React from "react";
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";

export default function() {
  const apps = ["Timer", "Stopwatch", "Speedometer", "Something", "Else", "And so on"];
  return (
    <div className={styles.container}>
      <header>Web Apps</header>
      <main>
        {/* <Link to="timer">Timer</Link> */}
        {apps.map((v, i) => (
          <Link key={i} to="timer">
            <img src="/logo192.png" alt="logo" />
            <span>{v}</span>
          </Link>
        ))}
      </main>
      <footer>
        Made by&nbsp;
        <a href="https://github.com/jeongtae" target="_blank" rel="noopener noreferrer">
          Jeongtae Kim
        </a>
      </footer>
    </div>
  );
}
