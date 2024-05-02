"use client";

import React from "react";

import { signInWithGoogle, signOut } from "@/lib/firebase/auth";

import useUserSession from "@/hooks/useUserSession";

import styles from "./Login.module.css";

export default function Login() {
  const user = useUserSession(null);

  const handleSignOut = (event: any) => {
    event.preventDefault();
    signOut();
  };

  const handleSignIn = (event: any) => {
    event.preventDefault();
    signInWithGoogle();
  };

  return (
    <div className={styles.container}>
      {user ? (
        <>
          {`Signed in as ${JSON.stringify(user.displayName)}`}
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
  );
}
