import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";

import TagButton from "@/components/TagButton";
import LoadingThemeButton from "@/components/LoadingThemeButton";

import { currentLocation, tagsForPath, tagsForRender } from "@/utils/const";

import styles from "./Header.module.css";

type HeaderProps = {
  tag?: string;
};

const SetThemeButton = dynamic(() => import("@/components/SetThemeButton"), {
  ssr: false,
  loading: () => <LoadingThemeButton />,
});

export default function Header({ tag = "" }: HeaderProps) {
  return (
    <div>
      <div className={styles.titleContainer}>
        <Image
          className={styles.logo}
          src="/logo.png"
          alt="Kota Cody Enokida's Logo"
          width={75}
          height={75}
          priority
        />
        <h1 className={styles.title}>A Blog by Kota Cody Enokida</h1>
      </div>
      <p className={styles.subtitle}>
        Unfiltered thoughts and experiences of my day to
        day.「榎田岬太の人生観」
      </p>
      <div className={styles.tags}>
        {tagsForRender.map((t, i) => (
          <TagButton
            tag={t}
            key={t}
            active={i === 0 ? tag === "" : tagsForPath[i - 1] === tag}
            href={i === 0 ? "/" : `/category/${tagsForPath[i - 1]}`}
          />
        ))}
      </div>
      <div className={styles.utilities}>
        <Link className={styles.now} href="/now">
          What I&apos;m doing <strong>now?</strong> 🗺️📍
        </Link>
        <div className={styles.divider} />
        <SetThemeButton />
      </div>
    </div>
  );
}
