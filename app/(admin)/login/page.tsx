"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signInWithGoogle, signOut } from "@/lib/firebase/auth";
import { getUserRole } from "@/lib/firebase/firestore";

import useUserSession from "@/hooks/useUserSession";

import styles from "./page.module.css";

export default function Page() {
  const user = useUserSession(null);
  const router = useRouter();

  const handleSignOut = (event: any) => {
    event.preventDefault();
    signOut();
  };

  const handleSignIn = (event: any) => {
    event.preventDefault();
    signInWithGoogle();
  };

  useEffect(() => {
    const getDocument = async () => {
      if (user && router) {
        const role = await getUserRole(user.email);
        if (role === "Admin") {
          router.push("/dashboard");
        }
      }
    };

    getDocument();
  }, [user, router]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {user ? (
          <>
            {`Signed in as ${JSON.stringify(user.displayName)}`}
            <p>
              Stop snooping around... Get back to{" "}
              <Link href={"/"} className={styles.link}>
                the homepage.
              </Link>
            </p>
            <a className={styles.login} href="#" onClick={handleSignOut}>
              Sign Out
            </a>
          </>
        ) : (
          <a className={styles.login} href="#" onClick={handleSignIn}>
            Sign In with Google
          </a>
        )}
      </div>
    </main>
  );
}
