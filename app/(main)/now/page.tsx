import Link from "next/link";

import Footer from "@/components/Footer";
import LinkButton from "@/components/LinkButton";

import { currentLocation } from "@/utils/const";

import styles from "./page.module.css";

export default async function Page() {
  return (
    <main className={styles.main}>
      <LinkButton href="/" text="← Back To Main" />
      <br />
      <br />
      <div className={styles.content}>
        <h1>Now 🗺️📍</h1>
        <p>
          This is like an <Link href="/about">About</Link> page, but just
          what&apos;s on goin&apos; on right now.
        </p>
        <p>~~~~~~~~</p>
        <p>
          <strong>Currently:</strong> Studying for some interviews. Thinking
          about the future. Just got back from a road trip around the Pacific
          Northwest. Love the greenness and uniqueness of Oregon. Reading more
          blogs and writing some of my own thoughts. Spending lots of time with
          the GF!
        </p>
        <p>
          <strong>Location:</strong> San Jose, CA
        </p>
        <p>
          <strong>Day Job:</strong> Not Applicable
        </p>
        <p>
          <strong>Interests:</strong> Reading, Philosophy, Cryptocurrencies,
          Coding, Indie Internet Content
        </p>
        <p className={styles.date}>Last updated: 6/07/2024</p>
        <p>~~~~~~~~</p>
        <p>
          Inspiration from{" "}
          <a href="https://sive.rs/" target="_blank" rel="noopener noreferrer">
            Derek Sivers
          </a>
          &apos;s{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.nownownow.com
          </a>
        </p>
      </div>

      <Footer />
    </main>
  );
}
