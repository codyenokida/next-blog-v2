"use client";

import { useEffect, useState } from "react";
import classNames from "classnames";

import Button from "@/components/Button";

import { getCommentsFromId, postComment } from "@/lib/firebase/firestore";
import { Timestamp } from "firebase/firestore";

import styles from "./Comments.module.css";

interface CommentsProps {
  id: string;
}

export default function Comments({ id }: CommentsProps) {
  const [localComments, setLocalComments] = useState<Comment[]>([]);

  const [author, setAuthor] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getData = async () => {
      const comments = await getCommentsFromId(id);
      if (comments) setLocalComments(comments);
    };

    getData();
  }, [id]);

  /**
   * Helper function to render comments
   */
  const renderComments = () => {
    if (localComments?.length === 0) {
      return (
        <p className={styles.noResult}>
          0 comments
          <br />
          Nothin to see here.
        </p>
      );
    }
    return (
      <div className={styles.container}>
        {localComments.map((comment, i) => {
          const formattedDatePosted = comment.datePosted
            ? comment.datePosted?.toDate()?.toLocaleDateString()
            : "";
          return (
            <article
              className={styles.comment}
              key={`${comment.author} ${comment.datePosted} ${i}`}
            >
              <span className={styles.author}>{comment.author}</span>
              <span className={styles.datePosted}>{formattedDatePosted}</span>
              <p className={styles.content}>{comment.content}</p>
            </article>
          );
        })}
      </div>
    );
  };

  const handlePostClick = async () => {
    try {
      setLoading(true);
      await postComment(id, author, content);
      // Locally refresh the comments to render
      setLocalComments([
        ...localComments,
        {
          author: author,
          content: content,
          datePosted: Timestamp.fromDate(new Date()),
        } as Comment,
      ]);
      setAuthor("");
      setContent("");
      setError("");
      setLoading(false);
    } catch (e: any) {
      console.error(e);
      setError(e);
      setLoading(false);
    }
  };

  return (
    <div>
      {renderComments()}
      <div className={styles.post}>
        <div className={styles.inputContainer}>
          <label>Your name</label>
          <input
            className={styles.input}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label>Content</label>
          <textarea
            className={classNames(styles.input, styles.textarea)}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <Button text="Post" onClick={handlePostClick} />
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </div>
  );
}
