import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { getBlogPostPreview, getPostFromId } from "@/lib/firebase/firestore";

import Footer from "@/components/Footer";
import LinkButton from "@/components/LinkButton";
import SpotifyPill from "@/components/SpotifyPill";
import PostContent from "@/components/PostContent";
import LoadingThemeButton from "@/components/LoadingThemeButton";

import styles from "./page.module.css";

interface PageProps {
  params: {
    id: string;
  };
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const posts = (await getBlogPostPreview()) || [];
  return posts.map((post) => ({
    id: post.id,
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

const Comments = dynamic(() => import("@/components/Comments"), {
  ssr: false,
});

export default async function Page({ params: { id } }: PageProps) {
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

  if (!post?.title) notFound();

  return (
    <main className={styles.main}>
      <div className={styles.buttons}>
        <LinkButton href="/" text="← Back To Main" />
        <SetThemeButton
          style={{
            border: `1px solid rgba(var(--foreground-rgb))`,
            fontSize: "0.8rem",
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
      <h2>Comments 💬</h2>
      <Comments id={id} />
      <Footer />
    </main>
  );
}
