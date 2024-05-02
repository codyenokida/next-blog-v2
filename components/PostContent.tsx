import Image from "next/image";
import styles from "./PostContent.module.css";

interface ContentProps {
  content: Content;
}

export default function PostContent({ content }: ContentProps) {
  if (content.type === "text") {
    return (
      <div className={styles.text} key={content.id}>
        {content.text}
      </div>
    );
  } else {
    return (
      <div className={styles.imageContainer} key={content.id}>
        <Image
          className={styles.image}
          src={content.imageURL}
          alt={content.alt}
        />
        {content.caption && <figcaption>{content.caption}</figcaption>}
      </div>
    );
  }
}
