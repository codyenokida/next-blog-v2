import Link from "next/link";

import {
  getBlogPostPreview,
  getBlogPostPreviewCached,
  getPostFromId,
} from "@/lib/firebase/firestore";

import styles from "./page.module.css";
import LinkButton from "@/components/LinkButton";
import SpotifyPill from "@/components/SpotifyPill";
import PostContent from "@/components/PostContent";
import dynamic from "next/dynamic";
import LoadingThemeButton from "@/components/LoadingThemeButton";

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const posts = await getBlogPostPreview();

  if (!posts) return [];

  return posts.map((post) => ({
    slug: post.id,
  }));
}

const SetThemeButton = dynamic(() => import("@/components/SetThemeButton"), {
  ssr: false,
  loading: () => (
    <LoadingThemeButton
      style={{
        border: `1px solid rgba(var(--foreground-rgb))`,
        fontSize: "inherit",
      }}
    />
  ),
});

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const post = (await getPostFromId(id)) || ({} as BlogPostData);
  const { title, dateType, spotify, startDate, endDate, content, datePosted } =
    post;

  const formattedStartDate = startDate
    ? startDate?.toDate()?.toLocaleDateString()
    : "";
  const formattedEndDate = endDate
    ? endDate?.toDate()?.toLocaleDateString()
    : "";
  const formattedDatePosted = datePosted
    ? datePosted?.toDate()?.toLocaleDateString()
    : "";

  if (!post) return null;

  return (
    <main className={styles.main}>
      <div className={styles.buttons}>
        <LinkButton href="/" text="← Back To Main" />
        <SetThemeButton
          style={{
            border: `1px solid rgba(var(--foreground-rgb))`,
            fontSize: "inherit",
          }}
        />
      </div>
      <SpotifyPill spotifyEmbedLink={spotify} />
      <header className={styles.title}>
        <h1 className={styles.title}>{title || ""}</h1>
        {dateType === "single" && (
          <p className={styles.date}>{formattedStartDate}</p>
        )}
        {dateType === "range" && (
          <p className={styles.date}>
            {formattedStartDate} - {formattedEndDate}
          </p>
        )}
      </header>
      <div className={styles.content}>
        {content?.map((c) => (
          <PostContent content={c} key={c.id} />
        ))}
      </div>
      <p className={styles.datePosted}>Date Posted: {formattedDatePosted}</p>
    </main>
  );
}
