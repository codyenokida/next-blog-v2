"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import { Reorder } from "framer-motion";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
// import Modal from "@/components/Modal";
import ReorderItem from "@/components/ReorderItem";
// import ImagePlaceholder from "@/components/Icons/ImagePlaceholder";

import { tagsForEdit } from "@/utils/const";
import {
  compressImage,
  formatDate,
  isValidSpotifyTrackURL,
} from "@/utils/helper";

import { uploadImageToStorage } from "@/lib/firebase/storage";
import { getPostFromIdCached, uploadPost } from "@/lib/firebase/firestore";

import styles from "./page.module.css";
import useUserSession from "@/hooks/useUserSession";
import ImageModal from "@/components/ImageModal";
import TextModal from "@/components/TextModal";

export default function Page() {
  const router = useRouter();

  // Controlled Form State
  const [form, setForm] = useState<Form>({} as Form);
  const [content, setContent] = useState<(TextContent | TempImageContent)[]>(
    []
  );
  const [dateType, setDateType] = useState<"single" | "range">("single");

  // Error State
  const [formError, setFormError] = useState<FormError>({} as FormError);

  // Modal State
  const [openImageModal, setOpenImageModal] = useState<boolean>(false);
  const [openTextModal, setOpenTextModal] = useState<boolean>(false);
  const [openPostConfirmationModal, setOpenPostConfirmationModal] =
    useState<boolean>(false);

  // Refs
  const hiddenFileInput = useRef<any>(null);
  const tagRef = useRef<any>(null);
  const titleRef = useRef<any>(null);
  const spotifyLinkRef = useRef<any>(null);
  const startDateRef = useRef<any>(null);
  const endDateRef = useRef<any>(null);

  useEffect(() => {
    setForm((prev) => ({ ...prev, content: content }));
  }, [content]);

  useEffect(() => {
    if (form.id) {
      updateFormError("id", "");
    }
    if (form.title) {
      updateFormError("title", "");
    }
    if (form.tag) {
      updateFormError("tag", "");
    }
    if (dateType === "single" && form.startDate) {
      updateFormError("date", "");
    }
    if (dateType === "range" && form.startDate && form.endDate) {
      updateFormError("date", "");
    }
    if (form.thumbnail) {
      updateFormError("thumbnail", "");
    }
    if (form.content) {
      updateFormError("content", "");
    }
  }, [form, dateType]);

  const handleClear = () => {
    setForm({} as Form);
    setFormError({} as FormError);
  };

  /**
   * Helper function to update controlled form state
   * @param e
   * @param type
   */
  const updateFormValue = (e: any, type: string) => {
    setForm((prev) => ({ ...prev, [type]: e.target.value }));
  };

  /**
   * Helper function to update controlled form state
   * @param e
   * @param type
   */
  const updateFormError = (type: string, errMsg: string) => {
    setFormError((prev) => ({ ...prev, [type]: errMsg }));
  };

  /**
   * Helper function to set thumbnail file into the form
   * @param e
   */
  const onThumbnailChange = async (e: HTMLInputEvent) => {
    const target = e.target as HTMLInputElement;

    if (target.files && target.files[0]) {
      const compressedThumbnail = await compressImage(target.files[0]);
      setForm({ ...form, thumbnail: compressedThumbnail });
    }
  };

  /**
   * Helper function to close modal
   */
  const handleCloseModal = () => {
    setOpenImageModal(false);
    setOpenTextModal(false);
  };

  const handleAddContent = (newContent: TextContent | TempImageContent) => {
    setContent([...content, newContent]);
  };

  /**
   * Handler for removing an index from content
   * @param {number} index
   */
  const handleRemoveContent = (index: number) => {
    const copy = [...content];
    if (index === 0) {
      copy.shift();
    } else if (index === content.length - 1) {
      copy.pop();
    } else {
      copy.splice(index, 1);
    }
    setContent(copy);
  };

  /**
   * Helper function to validate form
   * @returns boolean
   */
  const validateForm = () => {
    let error;
    if (!form.tag) {
      updateFormError("tag", "Submit a valid tag.");
      error = true;
    }
    if (!form.title) {
      updateFormError("title", "Submit a valid title.");
      error = true;
    }
    if (!form.spotify || !isValidSpotifyTrackURL(form.spotify)) {
      updateFormError("spotify", "Submit a valid spotify link.");
      error = true;
    }
    if (dateType === "single") {
      if (!form.startDate) {
        updateFormError("date", "Submit a valid start date.");
        error = true;
      }
    } else if (dateType === "range") {
      if (!form.startDate || !form.endDate) {
        updateFormError("date", "Submit both start and end date.");
        error = true;
      } else if (form.startDate && form.endDate) {
        const tempStartDate = new Date(form.startDate);
        const tempEndDate = new Date(form.endDate);
        if (tempStartDate > tempEndDate) {
          updateFormError(
            "date",
            "End date must be later than the start date."
          );
          error = true;
        }
      }
    }
    if (!form.thumbnail) {
      updateFormError("thumbnail", "Submit a thumbnail.");
      error = true;
    }
    if (!form.content || !form.content.length) {
      updateFormError("content", "Submit at least something.");
      error = true;
    }
    return error;
  };

  /**
   * Helper function to confirm submission
   */
  const confirmSubmission = async () => {
    /**
     * Uploading all assets
     */

    // If thumbnail alreday exists use, if not upload to storage
    const thumbnailUrl = await uploadImageToStorage(
      form.id,
      "thumbnail",
      form.thumbnail
    );

    // Upload all content images
    const contentToUpload = await Promise.all(
      form.content.map(async (section: any) => {
        if (section.type === "text") {
          return section;
        } else if (section.type === "image") {
          // If an image already exists, skip the upload process
          if (section.imageUrl) {
            return section;
          }
          const imageID = section.id;
          const imageFile = section.tempImage;
          const storageImageUrl = await uploadImageToStorage(
            form.id,
            imageID,
            imageFile
          );
          return {
            id: section.id,
            type: section.type,
            imageUrl: storageImageUrl,
            imageCaption: section.caption,
          };
        }
      })
    );

    // Generate Posted Date
    const datePosted = new Date();

    // Generate Metadata
    const postToUpload = {
      id: form.id,
      title: form.title,
      content: contentToUpload,
      datePosted,
      dateType,
      startDate: form.startDate ? new Date(form.startDate) : null,
      endDate: form.endDate ? new Date(form.endDate) : null,
      category: form.tag,
      spotifyLink: form.spotify || null,
      thumbnailImage: thumbnailUrl,
    };

    await uploadPost(form.id, postToUpload);

    try {
      // Only send email when posting
      // if (!edit) {
      //   await sendEmailPost(postId);
      // }
    } catch (e) {
      console.error(e);
    }

    router.push(`/post/${form.id}`);
  };

  /**
   * Helper function to submit controlled form
   * @param e
   */
  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check for Errors
    const error = validateForm();
    if (error) return;

    // Open modal
    setOpenPostConfirmationModal(true);
  };

  return (
    <main className={styles.main}>
      <Link href="/dashboard" passHref className={styles.backToHome}>
        <Button text="← Back to Dashboard" />
      </Link>
      <h1>Upload Post 🛠️</h1>
      <form className={styles.form} onSubmit={onFormSubmit}>
        <div className={styles.tag}>
          <label>Tag:</label>
          <select
            className={styles.tagSelect}
            onChange={(e) => updateFormValue(e, "tag")}
            defaultValue={"--- Select ---"}
            ref={tagRef}
          >
            {[0, ...tagsForEdit].map((tag, i) =>
              i === 0 ? (
                <option className={styles.tagSelectOption} disabled key={tag}>
                  --- Select ---
                </option>
              ) : (
                <option className={styles.tagSelectOption} key={tag}>
                  {tag}
                </option>
              )
            )}
          </select>
          {formError.tag && (
            <span className={styles.error}>{formError.tag}</span>
          )}
        </div>
        <div>
          <label>Title:</label>
          <input
            className={styles.title}
            placeholder="The Grand Adventure!"
            onChange={(e) => updateFormValue(e, "title")}
            ref={titleRef}
          />
          {formError.title && (
            <span className={styles.error}>{formError.title}</span>
          )}
        </div>
        <div>
          <label>Spotify Link:</label>
          <input
            className={styles.spotify}
            placeholder="https://open.spotify.com/track/7E4qUlNYocWix5FKBdw5CN?si=cf9dd73b32424903"
            onChange={(e) => updateFormValue(e, "spotifyLink")}
            ref={spotifyLinkRef}
          />
          {formError.spotify && (
            <span className={styles.error}>{formError.spotify}</span>
          )}
        </div>
        <div className={styles.date}>
          <div className={styles.container}>
            <label>Dates:</label>
            <div className={styles.dateType}>
              <button
                type="button"
                className={classNames(styles.dateButton, {
                  [styles.active]: dateType === "single",
                })}
                onClick={(e) => {
                  e.preventDefault();
                  setDateType("single");
                }}
              >
                Single
              </button>
              <button
                type="button"
                className={classNames(styles.dateButton, {
                  [styles.active]: dateType === "range",
                })}
                onClick={(e) => {
                  e.preventDefault();
                  setDateType("range");
                }}
              >
                Range
              </button>
            </div>
            {dateType === "single" && (
              <input
                type="date"
                className={styles.date}
                ref={startDateRef}
                value={form?.startDate}
                onChange={(e) => updateFormValue(e, "startDate")}
                data-date=""
                data-date-format="DD MMMM YYYY"
              />
            )}
            {dateType === "range" && (
              <div className="date-range-container">
                <input
                  type="date"
                  className={styles.date}
                  ref={startDateRef}
                  value={form.startDate}
                  onChange={(e) => updateFormValue(e, "startDate")}
                  data-date=""
                  data-date-format="DD MMMM YYYY"
                />{" "}
                to{" "}
                <input
                  type="date"
                  className={styles.date}
                  ref={endDateRef}
                  value={form.endDate}
                  onChange={(e) => updateFormValue(e, "endDate")}
                  data-date=""
                  data-date-format="DD MMMM YYYY"
                />
              </div>
            )}
          </div>
          {formError.date && (
            <span className={styles.error}>{formError.date}</span>
          )}
        </div>
        <div>
          <label>Thumbnail:</label>
          {form.thumbnail ? (
            <>
              <div className={styles.thumbnail}>
                <img
                  className={styles.image}
                  src={URL.createObjectURL(form.thumbnail)}
                  alt="Thumbnail preview"
                />
              </div>
              <Button
                text="Clear Thumbnail"
                onClick={(e: any) => {
                  e.preventDefault();
                  updateFormValue(e, "thumbnail");
                }}
              />
            </>
          ) : (
            <button className={styles.thumbnail}>
              <p>
                Thumbnail goes here!!!
                <br />
                <br />
                🖼️ 🌄
              </p>
              <input
                className={styles.hidden}
                ref={hiddenFileInput}
                type="file"
                onChange={onThumbnailChange}
              />
            </button>
          )}

          {formError.thumbnail && (
            <span className={styles.error}>{formError.thumbnail}</span>
          )}
        </div>
        <div className={styles.content}>
          <label>Content:</label>
          <div className={styles.items}>
            {formError.content && (
              <span className={styles.error}>{formError.content}</span>
            )}
            <Reorder.Group
              values={content}
              onReorder={setContent}
              className={styles.list}
            >
              {content.map((item: any, i: number) => (
                <ReorderItem
                  key={item.id}
                  type={item.type}
                  value={item}
                  index={i}
                  handleRemoveContent={handleRemoveContent}
                />
              ))}
            </Reorder.Group>
          </div>
          <div className={styles.buttons}>
            <Button
              text="Add Image 🖼️"
              onClick={(e: Event) => {
                e.preventDefault();
                setOpenImageModal(true);
              }}
            />
            <Button
              text="Add Text 📝"
              onClick={(e: Event) => {
                e.preventDefault();
                setOpenTextModal(true);
              }}
            />
          </div>
        </div>
        <div className={styles.buttons}>
          {/* <Button text="Clear All" onClick={handleClear} /> */}
          <Button text="Post" />
        </div>
      </form>
      <ImageModal
        open={openImageModal}
        handleClose={handleCloseModal}
        handleAddContent={handleAddContent}
      />
      <TextModal
        open={openTextModal}
        handleClose={handleCloseModal}
        handleAddContent={handleAddContent}
      />
    </main>
  );
}
