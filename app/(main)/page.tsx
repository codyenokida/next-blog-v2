import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostPreview from "@/components/PostPreview";

import { getBlogPostPreview } from "@/lib/firebase/firestore";

import styles from "./page.module.css";

export default async function Page() {
  const posts = (await getBlogPostPreview()) || [];

  return (
    <main className={styles.main}>
      <Header />
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
