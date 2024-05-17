"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { Reorder } from "framer-motion";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Timestamp } from "firebase/firestore";

import { tagsForEdit } from "@/utils/const";
import {
  compressImage,
  formatDate,
  isValidSpotifyTrackURL,
} from "@/utils/helper";

import { uploadImageToStorage } from "@/lib/firebase/storage";
import { getPostFromIdCached, uploadPost } from "@/lib/firebase/firestore";

import ImageModal from "@/components/ImageModal";
import TextModal from "@/components/TextModal";
import LinkButton from "@/components/LinkButton";
import ConfirmationModal from "@/components/ConfirmationModal";
import Button from "@/components/Button";
import ReorderItem from "@/components/ReorderItem";

import styles from "./page.module.css";

export default function Page({ params: { id } }: any) {
  const { data: _session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/api/auth/signin?callbackUrl=/post/${id}/edit`);
    },
  });

  const router = useRouter();

  // Controlled Form State
  const [form, setForm] = useState<FormEdit>({} as FormEdit);
  const [content, setContent] = useState<FormEditContent[]>([]);
  const [dateType, setDateType] = useState<"single" | "range">("single");
  const [thumbnailFromServer, setThumbnailFromServer] = useState<string>("");
  const [datedPosted, setDatePosted] = useState<Timestamp>(
    Timestamp.fromDate(new Date())
  );
  const [preview, setPreview] = useState<string>("");

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
  const idRef = useRef<any>(null);
  const spotifyLinkRef = useRef<any>(null);
  const startDateRef = useRef<any>(null);
  const endDateRef = useRef<any>(null);
  const previewRef = useRef<any>(null);

  // Pre-populate the data and fill out the form
  useEffect(() => {
    const getData = async () => {
      const post = await getPostFromIdCached(id);
      if (post) {
        tagRef.current.value = post.tag;
        idRef.current.value = post.id;
        titleRef.current.value = post.title;
        spotifyLinkRef.current.value = post.spotify;
        setDateType(post.dateType);

        if (post.startDate && startDateRef.current) {
          const startDate = formatDate(post.startDate.toDate());
          startDateRef.current.value = post.startDate.toDate();
          setForm((prev) => ({ ...prev, startDate }));
        }
        if (post.endDate && endDateRef.current) {
          const endDate = formatDate(post.endDate.toDate());
          endDateRef.current.value = post.endDate.toDate();
          setForm((prev) => ({ ...prev, endDate: endDate }));
        }

        if (post.content) {
          setContent(post.content);
        }

        if (post.thumbnailURL) {
          setThumbnailFromServer(post.thumbnailURL);
        }

        setDatePosted(post.datePosted);
        setPreview(post.preview);

        setForm((prev) => ({
          ...prev,
          tag: post.tag,
          id: post.id,
          title: post.title,
          spotify: post.spotify,
          dateType: post.dateType,
        }));
      }
    };

    getData();
  }, [id, dateType]);

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
    if (form.spotify && isValidSpotifyTrackURL(form.spotify)) {
      updateFormError("spotify", "");
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
    if (form.preview) {
      updateFormError("preview", "");
    }
  }, [form, dateType]);

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
    setOpenPostConfirmationModal(false);
  };

  const handleAddContent = (newContent: FormEditContent) => {
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
    if (!form.thumbnail && !thumbnailFromServer) {
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
    const thumbnailUrl = thumbnailFromServer
      ? thumbnailFromServer
      : await uploadImageToStorage(form.id, "thumbnail", form.thumbnail);

    // Upload all content images
    const contentToUpload: Content[] = await Promise.all(
      form.content.map(async (section: FormEditContent) => {
        if (section.type === "text") {
          return section;
        } else if (section.type === "image") {
          const { id, type, caption, alt } = section;
          if (section.imageURL) {
            const imageContent: ImageContent = {
              id: id,
              type: type,
              imageURL: section.imageURL,
              caption: caption,
              alt: alt,
            };
            return imageContent;
          }
          const tempImageFile = section.tempImageFile;
          const storageImageUrl =
            (await uploadImageToStorage(form.id, id, tempImageFile)) || "";
          const imageContent: ImageContent = {
            id: id,
            type: type,
            imageURL: storageImageUrl,
            caption: caption,
            alt: alt,
          };
          return imageContent;
        }
        return {} as Content;
      })
    );

    // Generate Metadata
    const postToUpload: BlogPostData = {
      id: form.id,
      title: form.title,
      content: contentToUpload,
      datePosted: datedPosted,
      dateType,
      startDate: Timestamp.fromDate(
        form.startDate ? new Date(form.startDate) : new Date()
      ),
      endDate: Timestamp.fromDate(
        form.endDate ? new Date(form.endDate) : new Date()
      ),
      tag: form.tag,
      spotify: form.spotify,
      thumbnailURL: thumbnailUrl,
      preview: form.preview || preview,
    };

    console.log(postToUpload);

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
      <LinkButton href="/dashboard" text="← Back to Dashboard" />
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
          <label>Slug (ID):</label>
          <input
            className={styles.input}
            placeholder="very-first-post"
            onChange={(e) => updateFormValue(e, "id")}
            ref={idRef}
          />
          {formError.id && <span className={styles.error}>{formError.id}</span>}
        </div>
        <div>
          <label>Title:</label>
          <input
            className={styles.input}
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
            className={styles.input}
            placeholder="https://open.spotify.com/track/7E4qUlNYocWix5FKBdw5CN?si=cf9dd73b32424903"
            onChange={(e) => updateFormValue(e, "spotify")}
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
          {thumbnailFromServer ? (
            <>
              <div className={styles.thumbnail}>
                <img
                  className={styles.image}
                  src={thumbnailFromServer}
                  alt="Thumbnail preview"
                />
              </div>
              <Button
                text="Clear Thumbnail"
                onClick={(e: any) => {
                  e.preventDefault();
                  setThumbnailFromServer("");
                  updateFormValue(e, "thumbnail");
                }}
              />
            </>
          ) : form.thumbnail ? (
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
      <ConfirmationModal
        open={openPostConfirmationModal}
        handleClose={handleCloseModal}
        uploadPost={confirmSubmission}
        previewRef={previewRef}
        preview={form.preview || preview}
        updateFormValue={updateFormValue}
      />
    </main>
  );
}
