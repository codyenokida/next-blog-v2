import classNames from "classnames";
import Link from "next/link";

import styles from "./TagButton.module.css";

export default function TagButton({ tag, active, href }: TagButtonProps) {
  return (
    <Link
      className={classNames(styles.button, { [styles.active]: active })}
      href={href}
    >
      {tag}
    </Link>
  );
}
