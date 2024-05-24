import Link from "next/link";
import Image from "next/image";

import Footer from "@/components/Footer";
import LinkButton from "@/components/LinkButton";

import styles from "./page.module.css";


export default async function Page() {
  return (
    <main className={styles.main}>
      <LinkButton href="/" text="← Back To Main" />
      <br />
      <br />
      <div className={styles.content}>
        <h1>About 🙋🏽🐰</h1>
        <p>
          <i>Kota Cody Enokida</i>
        </p>
        <p>
          I&apos;m 24 years old. A Software Developer. I work mostly on the web and
          am extremely driven to learn. Trying to improve my skills in the
          intersection between tech and design! 🐣
        </p>
        <p>
          I graduated from the University of California, Irvine with bachelor&apos;s
          degree in Computer Science. I previously worked at{" "}
          <Link href="https://c3.ai/">C3 AI</Link>,{" "}
          <Link href="https://www.beyond.ai/">Beyond Limits AI</Link>, and
          contributed to <Link href="https://www.airswap.io/">AirSwap</Link>.
        </p>
        <p>
          I love going outside and feeling the fresh air and sun on my body. 🌱
        </p>
        <p>
          I&apos;m most known by my friends for{" "}
          <Link href="/post/vietnam-one">biking SE Asia</Link>, being a food
          enjoyer, loving{" "}
          <Link href="https://www.memedroid.com/memes/detail/4057032/One-Piece-live-action-actors">
            One Piece
          </Link>
          , and writing this blog!
        </p>
        <p>
          I often take care of my girlfriend&apos;s bunny,{" "}
          <i>
            <strong>Filby</strong> - short for Filbert
          </i>
          !
        </p>
        <Image
          src="/filby.jpeg"
          alt="Filbert is a bunny"
          width={250}
          height={250}
        />
      </div>

      <Footer />
    </main>
  );
}
