import Image from "next/image";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getBlogPostPreview } from "@/lib/firebase/firestore";

import LoadingThemeButton from "@/components/LoadingThemeButton";
import TagButton from "@/components/TagButton";
import PostPreview from "@/components/PostPreview";

import { tagsForRender, tagsForEdit, tagsForQuery } from "@/utils/const";

import styles from "./page.module.css";

const orderBySwap = {
  asc: "desc",
  desc: "asc",
};

const SetThemeButton = dynamic(() => import("@/components/SetThemeButton"), {
  ssr: false,
  loading: () => <LoadingThemeButton />,
});

export const dynamicParams = false;

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  return tagsForEdit.map((tag) => ({
    slug: tag,
  }));
}

export default async function Page({
  params: { tag },
  searchParams: { order = "desc" },
}: any) {
  const posts =
    (await getBlogPostPreview({
      tag: tagsForEdit[tagsForQuery.findIndex((t) => t === tag)],
      order: order === "desc" ? "desc" : "asc",
    })) || [];

  const getActiveTag = (index: number) => {
    if (index !== 0) {
      return tag === tagsForQuery[index - 1];
    }
    return !tag;
  };

  const getTagHref = (index: number) => {
    if (index === 0) {
      return "/";
    }
    return `/${tagsForQuery[index - 1]}`;
  };

  return (
    <main className={styles.main}>
      <div className={styles.titleContainer}>
        <Image
          className={styles.logo}
          src="/logo.png"
          alt="Kota Cody Enokida's Logo"
          width={75}
          height={75}
          priority
        />
        <h1 className={styles.title}>A Blog by Kota Cody Enokida</h1>
      </div>

      <p className={styles.subtitle}>
        Unfiltered thoughts and experiences of my day to
        day.「榎田岬太の人生観」
      </p>

      <div className={styles.tags}>
        {tagsForRender.map((tag, i) => (
          <TagButton
            tag={tag}
            key={tag}
            active={getActiveTag(i)}
            href={getTagHref(i)}
          />
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.utilities}>
          <Link
            href={`/${tag}?order=${
              orderBySwap[order === "desc" ? "desc" : "asc"]
            }`}
            className={styles.sort}
          >
            Sort By Date {order === "asc" ? "⬆️" : "⬇️"}
          </Link>
          <div className={styles.divider} />
          <SetThemeButton />
        </div>
        <div className={styles.posts}>
          {posts.map((post) => (
            <PostPreview {...post} key={post.id} />
          ))}
        </div>
      </div>
    </main>
  );
}
