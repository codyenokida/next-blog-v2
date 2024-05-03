import classNames from "classnames";

import styles from "./TagButton.module.css";
import Link from "next/link";

export default function TagButton({ tag, href, active }: TagButtonProps) {
  return (
    <Link
      href={href}
      className={classNames(styles.button, { [styles.active]: active })}
    >
      {tag}
    </Link>
  );
}
