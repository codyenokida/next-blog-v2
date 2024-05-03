import classNames from "classnames";

import styles from "./TagButton.module.css";

export default function TagButton({ tag, active, onClick }: TagButtonProps) {
  return (
    <button
      className={classNames(styles.button, { [styles.active]: active })}
      onClick={onClick}
    >
      {tag}
    </button>
  );
}
