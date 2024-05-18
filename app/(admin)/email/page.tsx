"use client";

import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import {
  getEmailList,
  sendNotificationToEmailList,
} from "@/lib/firebase/firestore";

import LoadingThemeButton from "@/components/LoadingThemeButton";
import LinkButton from "@/components/LinkButton";
import Button from "@/components/Button";

import styles from "./page.module.css";

const SetThemeButton = dynamic(() => import("@/components/SetThemeButton"), {
  ssr: false,
  loading: () => (
    <LoadingThemeButton
      style={{
        border: `1px solid rgba(var(--foreground-rgb))`,
        fontSize: "0.8rem",
      }}
    />
  ),
});

export default function Page() {
  const { data: _session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/api/auth/signin?callbackUrl=/email`);
    },
  });

  const [emails, setEmails] = useState<EmailUser[]>([]);
  const [slug, setSlug] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      const emailList = await getEmailList();
      setEmails(emailList);
    };

    getData();
  }, []);

  const handleButtonClick = async () => {
    try {
      setError("");
      setLoading(true);
      await sendNotificationToEmailList(slug);
      setLoading(false);
      setCompleted(true);
    } catch (e: any) {
      console.error(e.message);
      setLoading(false);
      setError(e.message);
      setCompleted(false);
    }
  };

  return (
    <main className={styles.main}>
      <LinkButton href="/dashboard" text="← Back to Dashboard" />
      <div className={styles.header}>
        <h1>Send to Email List</h1>
        <SetThemeButton
          style={{
            border: `1px solid rgba(var(--foreground-rgb))`,
            fontSize: "0.8rem",
          }}
        />
      </div>
      <p>Sending to {emails.length} subscribers :D</p>
      <div className={styles.links}>
        <label>Slug</label>
        <input value={slug} onChange={(e) => setSlug(e.target.value)} />
        <br />
        <Button
          text={completed ? "Sent :D" : "Send!!"}
          onClick={handleButtonClick}
          loading={loading}
          disabled={completed}
        />
        {error && <span>{error}</span>}
      </div>
    </main>
  );
}
