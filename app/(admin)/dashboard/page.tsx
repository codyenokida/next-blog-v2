import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { getBlogPostPreview } from "@/lib/firebase/firestore";

import styles from "./page.module.css";
import dynamic from "next/dynamic";
import LoadingThemeButton from "@/components/LoadingThemeButton";
import LinkButton from "@/components/LinkButton";

const SetThemeButton = dynamic(() => import("@/components/SetThemeButton"), {
  ssr: false,
  loading: () => (
    <LoadingThemeButton
      style={{
        border: `1px solid rgba(var(--foreground-rgb))`,
        fontSize: "0.8rem",
      }}
    />
  ),
});

export default async function Page() {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  const posts = (await getBlogPostPreview()) as BlogPostPreview[];

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>Manage My Blog</h1>
        <SetThemeButton
          style={{
            border: `1px solid rgba(var(--foreground-rgb))`,
            fontSize: "0.8rem",
          }}
        />
      </div>
      <div className={styles.links}>
        <Link href="/">🏠 Back to Home</Link>
        <Link href="/post/upload">🎞️ Upload Post</Link>
        <a
          target="_blank"
          href={`https://vercel.com/${process.env.VERCEL_TEAM_NAME}/${process.env.VERCEL_PROJECT_NAME}/deployments`}
          rel="noopener noreferrer"
        >
          🔼 Redeploy Cache on Vercel
        </a>
        <Link href="/email">📧 Send Email</Link>
        <span>🚧 Edit Post</span>
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/post/${post.id}/edit`}>{post.title}</Link>
            </li>
          ))}
        </ul>
        <br />
        <LinkButton text="🛌 Sign Out" href="/api/auth/signout" />
      </div>
    </main>
  );
}
