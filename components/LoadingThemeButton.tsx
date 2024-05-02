import styles from "./SetThemeButton.module.css";

const LoadingThemeButton = ({ style }: any) => {
  return (
    <button className={styles.button} style={style}>
      ☁️
    </button>
  );
};

export default LoadingThemeButton;
