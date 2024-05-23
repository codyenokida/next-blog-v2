import { notFound } from "next/navigation";

import PostPreviewSkeleton from "@/components/PostPreviewSkeleton";
import PostPreview from "@/components/PostPreview";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { getBlogPostPreview } from "@/lib/firebase/firestore";

import { tagsForPath } from "@/utils/const";

import styles from "./page.module.css";

// Return a list of `params` to populate the [tag] dynamic segment
export async function generateStaticParams() {
  return tagsForPath.map((tag) => ({
    tag,
  }));
}

const tagMap = {
  life: "Life",
  thoughts: "Thoughts",
  bicycle: "Bicycle",
  reviews: "Reviews",
  misc: "Misc.",
};

interface PageProps {
  params: {
    tag: "life" | "thoughts";
  };
}

export default async function Page({ params: { tag } }: PageProps) {
  if (!tagMap[tag]) notFound();
  const posts = (await getBlogPostPreview({ tag: tagMap[tag] })) || [];

  return (
    <main className={styles.main}>
      <Header tag={tag} />
      <div className={styles.content}>
        <div className={styles.posts}>
          {posts.map((post, i) => (
            <PostPreview {...post} key={post.id} index={i} />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
