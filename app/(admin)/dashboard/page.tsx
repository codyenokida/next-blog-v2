"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { signInWithGoogle, signOut } from "@/lib/firebase/auth";
import { getUserRole } from "@/lib/firebase/firestore";

import useUserSession from "@/hooks/useUserSession";

import styles from "./page.module.css";

export default function Page() {
  const user = useUserSession(null);
  const router = useRouter();

  const [admin, setAdmin] = useState(false);

  const handleSignOut = (event: any) => {
    event.preventDefault();
    signOut();
    router.push("/login");
  };

  useEffect(() => {
    const getDocument = async () => {
      if (user) {
        const role = await getUserRole(user.email);
        if (role !== "Admin") {
          router.push("/");
        }
        setAdmin(true);
      }
    };

    getDocument();
  }, [user, router]);

  if (!user && !admin) {
    return null;
  }

  if (admin) {
    return (
      <main className={styles.main}>
        <h1>Sup</h1>
        <Link href="/post/upload">Create post</Link>
        <a className={styles.login} href="#" onClick={handleSignOut}>
          Sign Out
        </a>
      </main>
    );
  }
}
