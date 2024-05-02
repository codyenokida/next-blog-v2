"use client";

import { useState, useEffect } from "react";
import styles from "./SetThemeButton.module.css";

const SetThemeButton = ({ style }: any) => {
  const [theme, setTheme] = useState(global.window?.__theme || "light");

  const isDark = theme === "dark";

  const toggleTheme = () => {
    global.window?.__setPreferredTheme(isDark ? "light" : "dark");
  };

  useEffect(() => {
    global.window.__onThemeChange = setTheme;
  }, []);

  return (
    <button className={styles.button} style={style} onClick={toggleTheme}>
      {isDark ? "🌙" : "🔆"}
    </button>
  );
};

export default SetThemeButton;
