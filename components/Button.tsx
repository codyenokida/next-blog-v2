import styles from "./Button.module.css";

interface ButtonProps {
  text: string;
  onClick?: any;
  loading?: boolean;
  disabled?: boolean;
}

export default function Button({
  text,
  onClick,
  loading,
  disabled,
}: ButtonProps) {
  return (
    <button className={styles.button} onClick={onClick} disabled={disabled}>
      {loading ? "Loading..." : text}
    </button>
  );
}
