import Link from "next/link";

import Button from "@/components/Button";

import styles from "./LinkButton.module.css";

interface LinkButtonProps {
  href: string;
  text: string;
}

export default function LinkButton({ href, text }: LinkButtonProps) {
  return (
    <Link href={href} passHref className={styles.link}>
      <Button text={text} />
    </Link>
  );
}
