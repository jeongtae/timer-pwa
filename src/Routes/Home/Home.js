import React from "react";
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";

export default function() {
  const apps = [
    { title: "Timer", link: "timer", image: "/logo192.png" },
    { title: "Stopwatch", link: "timer", image: "/logo192.png" },
    { title: "Speedometer", link: "timer", image: "/logo192.png" },
    { title: "Something", link: "timer", image: "/logo192.png" },
    { title: "Else", link: "timer", image: "/logo192.png" },
    { title: "And so on", link: "timer", image: "/logo192.png" }
  ];
  return (
    <div className={styles.container}>
      <header>Web Apps</header>
      <main>
        {apps.map(({ title, link, image }, index) => (
          <Link key={index} to={link}>
            <img src={image} alt={`${title} icon`} />
            <span>{title}</span>
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
