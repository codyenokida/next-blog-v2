"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

import Button from "@/components/Button";

import styles from "./TextModal.module.css";

export default function ImageModal({
  open,
  handleClose,
  handleAddContent,
}: TextModalProps) {
  const [text, setText] = useState<string>("");

  const addTextToContent = () => {
    let item = {} as TextContent;
    if (text) {
      item = {
        type: "text",
        id: uuidv4(),
        text,
      };
      setText("");
      handleAddContent(item);

      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className={styles.modal}>
        <h1 className={styles.title}>Upload Text</h1>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className={styles.buttons}>
          <Button text="Close" onClick={handleClose} />
          <Button text="Post" onClick={addTextToContent} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
