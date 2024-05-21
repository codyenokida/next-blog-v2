import Footer from "@/components/Footer";

import styles from "./page.module.css";
import LinkButton from "@/components/LinkButton";
import { currentLocation } from "@/utils/const";

export default async function Page() {
  return (
    <main className={styles.main}>
      <LinkButton href="/" text="← Back To Main" />
      <br />
      <br />
      <h1>Now 🗺️📍</h1>
      <p className={styles.date}>Last updated: 5/20/2024</p>
      <p>
        <strong>Location:</strong> {currentLocation}
      </p>
      <p>
        <strong>Me:</strong> Exploring options of my future from the comfort of
        my own childhood home. Spending lots of time with my family, making
        slime with my sister and her middle school science class, reading blogs,
        playing soccer, surfing at Newport Beach, and focusing on learning.
      </p>
      <p>
        <strong>Day Job:</strong> None at the moment
      </p>
      <p>
        <strong>Current Interests:</strong> Philosophy, Crypto, Coding, Indie
        Internet Content
      </p>
      <p>~~~~~</p>
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
      <Footer />
    </main>
  );
}
