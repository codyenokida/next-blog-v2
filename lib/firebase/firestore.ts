/**
 * Helper Firestore APIs
 */
import { cache } from "react";
import emailjs from "@emailjs/browser";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
  orderBy,
  Query,
  setDoc,
  deleteDoc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "./firebase";

import { wait } from "@/utils/helper";

/**
 *
 * @param {Query} q Query
 * @param param1
 * @returns
 */
function applyQueryFilters(
  q: Query,
  { id, tag, order = "desc" }: FirestoreBlogPostPreviewQuery
) {
  if (id) {
    q = query(q, where("id", "==", id));
  }
  if (tag) {
    q = query(q, where("tag", "==", tag));
  }
  if (order) {
    q = query(q, orderBy("datePosted", order));
  }
  return q;
}

/**
 * Function to get user roles
 *
 * @param {string} id
 * @returns {string}
 */
export async function getUserRole(id: string) {
  try {
    const queryRef = query(collection(db, "users"), where("id", "==", id));
    const collectionSnap = await getDocs(queryRef);
    const collectionArray = collectionSnap?.docs?.map((doc) => doc.data());
    if (collectionArray === undefined || collectionArray === null) {
      return "";
    }
    if (collectionArray && collectionArray.length)
      return collectionArray[0].role;
    return "";
  } catch (e) {
    return "";
  }
}

/**
 * Function to get post items (simplifed)
 *
 * @param {FirestoreQuery} q Query
 * @returns
 */
export async function getBlogPostPreview(
  q: FirestoreBlogPostPreviewQuery = {}
) {
  try {
    let queryRef = query(collection(db, "post-previews"));
    queryRef = applyQueryFilters(queryRef, q);
    const collectionSnap = await getDocs(queryRef);
    const collectionArray = collectionSnap?.docs?.map((doc) => doc.data());
    if (collectionArray === undefined || collectionArray === null) {
      return [];
    }
    if (collectionArray && collectionArray.length)
      return collectionArray as BlogPostPreview[];
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Helper function to retrive a post given an ID
 *
 * @param {string} postId ID of the post you want to retrieve
 * @returns
 */
export async function getPostFromId(postId: string) {
  if (!postId) return;
  let queryRef = query(collection(db, "post"));
  queryRef = applyQueryFilters(queryRef, { id: postId });
  const collectionSnap = await getDocs(queryRef);
  const collectionArray = collectionSnap?.docs?.map((doc) => doc.data());
  if (collectionArray && collectionArray.length)
    return collectionArray[0] as BlogPostData;
}

/**
 * Function to get comments from a post given an ID
 *
 * @param {string} id Post ID
 * @returns
 */
export async function getCommentsFromId(id: string) {
  try {
    const queryRef = query(collection(db, "comments"), where("id", "==", id));
    const collectionSnap = await getDocs(queryRef);
    const collectionArray = collectionSnap?.docs?.map((doc) =>
      doc.data()
    ) as CommentData[];
    if (collectionArray === undefined || collectionArray === null) {
      return [];
    }
    if (collectionArray && collectionArray.length)
      return collectionArray[0].comments as Comment[];
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Function to post a comment given and ID, author, and content
 *
 * @param {string} id
 * @param {string} author
 * @param {string} content
 */
export async function postComment(id: string, author: string, content: string) {
  if (!author) {
    throw "Comment needs an Author.";
  }
  if (!content) {
    throw "Comment needs content";
  }
  if (!id) {
    throw "Error: No post id";
  }
  const postRef = doc(db, "comments", id);
  const datePosted = new Date();

  // Atomically add a new comment to the "comments" array field.
  await updateDoc(postRef, {
    comments: arrayUnion({
      author,
      content,
      datePosted,
    }),
  });
}

export async function uploadPost(id: string, post: BlogPostData) {
  if (!id) return;
  // const blogPostItemRef = doc(db, "posts", `${id}`);
  const blogPostItemRef = doc(db, "post-previews", `${id}`);
  const blogPostContentRef = doc(db, "post", `${id}`);
  const blogCommentRef = doc(db, "comments", id);

  const item: BlogPostPreview = {
    id: post.id,
    datePosted: post.datePosted as Timestamp, // Date gets converted in Timestamp in Firestore
    title: post.title,
    thumbnailURL: post.thumbnailURL,
    preview: post.preview,
    tag: post.tag,
  };
  setDoc(blogPostItemRef, { ...item }, { merge: true });
  setDoc(blogPostContentRef, { ...post }, { merge: true });
  setDoc(blogCommentRef, { comments: [], id: post.id }, { merge: true });
}

export async function deletePost(id: string) {
  if (!id) return;
  await deleteDoc(doc(db, "posts", id));
  await deleteDoc(doc(db, "blog-post", id));
}

export async function getEmailList() {
  const collectionRef = collection(db, "email-list");
  const collectionSnap = await getDocs(collectionRef);
  const emailList = collectionSnap?.docs?.map((doc) =>
    doc.data()
  ) as EmailUser[];
  return emailList;
}

export async function addToEmaiList(name: string, email: string) {
  const emailListDocRef = doc(db, "email-list", email);

  const collectionObj = {
    name,
    email,
  };

  setDoc(emailListDocRef, { ...collectionObj }, { merge: true });
}

export async function sendNotificationToEmailList(slug: string) {
  // Error check the slug
  const post = await getPostFromId(slug);
  if (!post) {
    throw { message: "Post does not exist" };
  }

  const collectionRef = collection(db, "email-list");
  const collectionSnap = await getDocs(collectionRef);
  const list = collectionSnap?.docs?.map((doc) => doc.data());
  if (!list.length) return false;
  for (const user of list) {
    const { email, name } = user;
    const templateParams = {
      slug: slug,
      recipient: email,
      to_name: name,
    };
    wait(2200);
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID || "",
        "blog-template",
        templateParams,
        process.env.NEXT_PUBLIC_EMAIL_API_KEY
      );
    } catch (error) {
      console.error(error);
    }
  }
  return true;
}

export async function sendEmailSubscribed(name: string, email: string) {
  const templateParams = {
    recipient: email,
    to_name: name,
  };
  try {
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID || "",
      "blog-sub",
      templateParams,
      process.env.NEXT_PUBLIC_EMAIL_API_KEY
    );
  } catch (error) {
    console.error(error);
  }
}

export async function unsubscribeFromEmailList(email: string) {
  try {
    const emailListDocRef = doc(db, "email-list", email);
    deleteDoc(emailListDocRef);
  } catch (error) {
    console.error(error);
  }
}

// Helpers for migration

// export async function migratePosts() {
//   const posts = await getPosts();
//   for (const post of posts) {
//     const blogPostRef = doc(db, "posts", `${post.id}`);
//     const item = {
//       id: post.id,
//       datePosted: post.datePosted,
//       title: post.title,
//       category: post.category,
//       // thumbnail: post.thumbnailImage,
//     };
//     setDoc(blogPostRef, { ...item }, { merge: true });
//   }
// }

/**
 * Helper function to retrive a post given an ID
 *
 * @param {string} postId ID of the post you want to retrieve
 * @returns
 */
export async function getPostFromOldId(postId: string) {
  if (!postId) return;
  let queryRef = query(collection(db, "blog-post"));
  queryRef = applyQueryFilters(queryRef, { id: postId });
  const collectionSnap = await getDocs(queryRef);
  const collectionArray = collectionSnap?.docs?.map((doc) => doc.data());
  if (collectionArray && collectionArray.length)
    return collectionArray[0] as BlogPostData;
}

const mapping = {
  "fe401529-533e-485f-a1d8-83eb78b587b7": "thailand",
  "ff63c850-5472-4574-80b3-4c10c6702557": "cambodia",
  "0ca856bc-4aa0-4243-bb47-bb28b79980c8": "vietnam-three",
  "e5dccacb-0885-42e7-af52-45caf1b37fc0": "vietnam-two",
  "947c7d25-d5c8-4024-99f3-015e611c3001": "vietnam-one",
  "ced579ed-f20b-4b69-ae3c-58e82f3dcdc8": "important-encounters",
  "95d1469c-cec3-4675-ad2f-ac6e75aeb6c3": "goodbye-bay-area",
  "2d4b1863-9753-4e28-b630-b305217cd2ab": "what-comes-next-2024",
  "3660c2ac-d614-4b4e-8487-ae6463965b23": "walk-around-the-block",
  "6989de90-5c25-4b21-ae5c-20a9079d895e": "the-last-lecture",
  "13aeda32-c240-4384-9035-d972272c5246": "nick-dorian",
  "23e72cfd-0066-4559-8d08-b058966fd52d": "fam-takes-seattle",
  "7d6e7229-768e-4da0-aff3-d4ddea4913a1": "starting-a-blog",
};

export async function migrateComments() {
  for (const map of Object.entries(mapping)) {
    const prevID = map[0];
    const newID = map[1];

    const post = (await getPostFromOldId(prevID)) as any;
    if (post) {
      const comments = post.comments;
      let newComments = [];
      for (const comment of comments) {
        newComments.push({
          author: comment.author,
          datePosted: Timestamp.fromDate(new Date(comment.datePosted)),
          content: comment.content,
        });
      }
      const postRef = doc(db, "comments", newID);
      // Atomically add a new comment to the "comments" array field.
      setDoc(postRef, { id: newID, comments: newComments }, { merge: true });
    }
  }
}

export const getBlogPostPreviewCached = cache(getBlogPostPreview);
export const getPostFromIdCached = cache(getPostFromId);
