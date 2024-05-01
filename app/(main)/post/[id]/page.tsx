import Link from "next/link";

import {
  getPostFromIdCached,
  getBlogPostPreviewCached,
} from "@/lib/firebase/firestore";

import styles from "./page.module.css";

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const posts = await getBlogPostPreviewCached();

  if (!posts) return null;

  return posts.map((post) => ({
    slug: post.id,
  }));
}

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const post = await getPostFromIdCached(id);
  console.log(post);
  return (
    <main className={styles.main}>
      <Link href="/">Back To Home</Link>
    </main>
  );
}
