"use client";

import useUserSession from "@/hooks/useUserSession";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { getUserRole } from "@/lib/firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const user = useUserSession(null);
  const router = useRouter();

  const [admin, setAdmin] = useState(false);

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
  }, [user]);

  if (admin) {
    return (
      <main className={styles.main}>
        <h1>Sup</h1>
        <Link href="/post/upload">Create post</Link>
      </main>
    );
  }
}
