import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import { v4 as uuidv4 } from "uuid";

import { storage } from "./firebase";

/**
 * Upload image to storage
 * @param postId
 * @param imageId
 * @returns
 */
export async function uploadImageToStorage(
  postId: string,
  imageId: string,
  image: Blob | undefined
) {
  if (!postId || !image) {
    return "";
  }
  const storageRef = ref(storage, `images/${postId}/${imageId}`);
  const task = await uploadBytes(storageRef, image);
  const url = await getDownloadURL(task.ref);
  return url;
}

export async function deleteImagesFromStorage(postId: string) {}
