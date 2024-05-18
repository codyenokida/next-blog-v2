"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import Button from "@/components/Button";

import { unsubscribeFromEmailList } from "@/lib/firebase/firestore";

import styles from "./page.module.css";

const Page = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") as string;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [complete, setComplete] = useState<boolean>(false);

  const unsubscribe = async () => {
    try {
      setLoading(true);
      setComplete(false);
      setError("");
      await unsubscribeFromEmailList(email);
      setLoading(false);
      setComplete(true);
    } catch (e: any) {
      setLoading(false);
      setError(e.message);
      setComplete(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Sad to see you go 😢</h1>
      {complete ? (
        <p>You&apos;re unsubscribed now!</p>
      ) : (
        <Button
          text="Unsubscribe"
          onClick={unsubscribe}
          loading={loading}
        ></Button>
      )}
      {error && <span>{error}</span>}
      <Link href="/">Go back home!!</Link>
    </main>
  );
};

export default Page;
