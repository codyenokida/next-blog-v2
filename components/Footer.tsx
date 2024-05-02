import React from "react";
import Link from "next/link";

import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <p>
          Made using{" "}
          <a
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            NextJS 👨‍💻
          </a>
        </p>
        <p>
          Want to get notified on each post?{" "}
          <Link href="/email-list">Sign up here! 📧</Link>
        </p>
      </div>
    </footer>
  );
}
