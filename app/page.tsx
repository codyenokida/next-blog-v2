import Image from "next/image";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import LoadingThemeButton from "@/components/LoadingThemeButton";

const SetThemeButton = dynamic(() => import("@/components/SetThemeButton"), {
  ssr: false,
  loading: () => <LoadingThemeButton />,
});

export default function Home() {
  return (
    <main className={styles.main}>
      <SetThemeButton />
    </main>
  );
}
