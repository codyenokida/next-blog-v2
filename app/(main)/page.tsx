"use client";

import Image from "next/image";
import styles from "./page.module.css";
import dynamic from "next/dynamic";
import LoadingThemeButton from "@/components/LoadingThemeButton";
import { tagsForRender } from "@/utils/const";
import TagButton from "@/components/TagButton";
import { useEffect, useState } from "react";
import { getBlogPostPreviewCached } from "@/lib/firebase/firestore";
import PostItem from "@/components/PostItem";

const orderBySwap = {
  asc: "desc",
  desc: "asc",
};

const SetThemeButton = dynamic(() => import("@/components/SetThemeButton"), {
  ssr: false,
  loading: () => <LoadingThemeButton />,
});

export default function Page() {
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");
  const [activeTagIndex, setActiveTagIndex] = useState(0);

  /**
   * Side Effect to fetch posts
   */
  useEffect(() => {
    const getDocument = async () => {
      setLoading(true);
      const tag =
        activeTagIndex !== 0 ? tagsForRender[activeTagIndex] : undefined;
      const data = await getBlogPostPreviewCached({
        tag,
        order: orderBy,
      });
      if (data) {
        setPosts(data);
      }
      setLoading(false);
    };

    getDocument();
  }, [activeTagIndex, orderBy]);

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
        day.「榎田岬田の人生観」
      </p>

      <div className={styles.tags}>
        {tagsForRender.map((tag, i) => (
          <TagButton
            tag={tag}
            key={tag}
            active={activeTagIndex === i}
            onClick={() => setActiveTagIndex(i)}
          />
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.utilities}>
          <button
            className={styles.sort}
            onClick={() => setOrderBy(orderBySwap[orderBy] as "asc" | "desc")}
          >
            Sort By Date {orderBy === "asc" ? "⬆️" : "⬇️"}
          </button>
          <div className={styles.divider} />
          <SetThemeButton />
        </div>
        <div className={styles.posts}>
          {posts.map((post) => (
            <PostItem {...post} key={post.id} />
          ))}
        </div>
      </div>
    </main>
  );
}
