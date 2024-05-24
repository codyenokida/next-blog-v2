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
          This is like an <Link href="/about">About</Link> page, but just what&apos;s
          on goin&apos; on right now.
        </p>
        <p>~~~~~~~~</p>
        <p>
          <strong>Currently:</strong> Exploring options of my future from the
          comfort of my own childhood home. Applying to jobs. Spending lots of
          time with my family. Making slime with my sister and her middle school
          science class. Reading a ton of blogs. Writing a ton of my own
          thoughts. Playing soccer. Focusing on learning. Trying to be a better
          design engineer on the web.
        </p>
        <p>
          <strong>Location:</strong> {currentLocation}
        </p>
        <p>
          <strong>Day Job:</strong> Freelancing
        </p>
        <p>
          <strong>Interests:</strong> Reading, Philosophy, Cryptocurrencies,
          Coding, Indie Internet Content
        </p>
        <p>
          I&apos;m currently reading <strong>The Courage to Be Disliked</strong> by{" "}
          <i>Ichiro Kishimi and Fumitake Koga</i>.
        </p>
        <p className={styles.date}>Last updated: 5/23/2024</p>
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
