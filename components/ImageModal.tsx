"use client";

import { useRef, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

import styles from "./ImageModal.module.css";
import { compressImage } from "@/utils/helper";
import Button from "@/components/Button";

export default function ImageModal({
  open,
  handleClose,
  handleAddContent,
}: ImageModalProps) {
  // Image Inputs
  const [image, setImage] = useState<File>();
  const [caption, setCaption] = useState<string>("");
  const [alt, setAlt] = useState<string>("");
  const hiddenFileInput = useRef(null);

  /**
   * Function that handles image change
   * @param {Event} event
   */
  const onImageChange = async (event: HTMLInputEvent) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const compressedImage = await compressImage(target.files[0]);
      setImage(compressedImage);
    }
  };

  const addImageToContent = () => {
    let item = {} as TempImageContent;
    if (image && alt && caption) {
      item = {
        type: "image",
        id: uuidv4(),
        tempImageFile: image,
        alt,
        caption,
      };
      setImage(undefined);
      setCaption("");
      setAlt("");
      handleAddContent(item);

      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className={styles.modal}>
        <h1 className={styles.title}>Upload Image</h1>
        {image ? (
          <>
            <div className={styles.picture}>
              <img
                className={styles.image}
                src={URL.createObjectURL(image)}
                alt="Image to upload"
              />
            </div>
            <Button text="Clear Photo" onClick={() => setImage(undefined)} />
            <br />
          </>
        ) : (
          <button className={styles.picture}>
            <p className={styles.placeholder}>Photo goes here!!!</p>
            <input
              ref={hiddenFileInput}
              className={styles.hidden}
              type="file"
              onChange={onImageChange}
              onClick={onImageChange}
            />
          </button>
        )}
        <label className={styles.label}>Alt attribute</label>
        <input
          className={styles.input}
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
        />
        <label className={styles.label}>Caption (not required)</label>
        <input
          className={styles.input}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <div className={styles.buttons}>
          <Button text="Close" onClick={handleClose} />
          <Button text="Add" onClick={addImageToContent} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
