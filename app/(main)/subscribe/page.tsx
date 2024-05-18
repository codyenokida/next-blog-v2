"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { validateEmail } from "@/utils/helper";

import Button from "@/components/Button";

import {
  addToEmaiList,
  getEmailList,
  sendEmailSubscribed,
} from "@/lib/firebase/firestore";

import styles from "./page.module.css";

const Page = () => {
  // Email List
  const [emailList, setEmailList] = useState<any[]>([]);

  // Form States
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // Error States
  const [nameError, setNameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");

  // Complete State
  const [loading, setLoading] = useState<boolean>(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (name) {
      setNameError(false);
    }
  }, [name]);

  useEffect(() => {
    if (validateEmail(email)) {
      setEmailError("");
    }
  }, [email]);

  useEffect(() => {
    const getDocument = async () => {
      const emailList = await getEmailList();
      setEmailList(emailList);
    };
    getDocument();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    let error;

    if (!name) {
      error = true;
      setNameError(true);
    }

    if (!email || !validateEmail(email)) {
      error = true;
      setEmailError("Not a valid Email");
    }

    if (error) {
      setLoading(false);
      return;
    }

    // Check if the email is already on the list
    if (emailList.find((emailInDb) => emailInDb.email === email)) {
      setEmailError("Email already on the mailing list.");
      return;
    }

    // Add to firestore
    await addToEmaiList(name, email);

    // Send confirmation email
    await sendEmailSubscribed(name, email);

    setCompleted(true);
    setLoading(false);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Thanks for considering to subscribe c:</h1>
      <div className={styles.subscribe}>
        <label className={styles.label}>Name</label>
        <input
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {nameError && <span className={styles.error}>Write down a name!!</span>}
        <label className={styles.label}>Email</label>
        <input
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!!emailError && <span className={styles.error}>{emailError}</span>}
        <br />
        <Button
          text={completed ? "Completed ✅" : loading ? "Loading..." : "Submit"}
          onClick={handleSubmit}
          loading={loading}
          disabled={nameError || !!emailError}
        />
        {completed && (
          <p>
            <br />A confirmation email has been sent! You may need to check your
            spam folder. It&apos;s coming from kotaenokida@gmail.com
          </p>
        )}
      </div>
      <Link href="/">Go back home!!</Link>
    </main>
  );
};

export default Page;
