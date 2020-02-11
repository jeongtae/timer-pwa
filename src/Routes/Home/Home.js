import React from "react";
import styles from "./Home.module.scss";
import { Link } from "react-router-dom";

export default function() {
  return (
    <>
      <p>Home</p>
      <Link to="timer">Timer</Link>
    </>
  );
}
