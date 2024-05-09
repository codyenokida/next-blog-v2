import { Dialog, DialogContent } from "@mui/material";

import Button from "@/components/Button";

import styles from "./ConfirmationModal.module.css";

export default function ConfirmationModal({
  open,
  handleClose,
  uploadPost,
  preview,
  previewRef,
  updateFormValue,
}: any) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className={styles.modal}>
        <h1 className={styles.title}>Are you sure you want to upload?</h1>
        <label>Preview</label>
        <textarea
          className={styles.textarea}
          value={preview}
          ref={previewRef}
          onChange={(e) => updateFormValue(e, "preview")}
        />
        <div className={styles.buttons}>
          <Button text="Close" onClick={handleClose} />
          <Button text="Upload" onClick={uploadPost} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
