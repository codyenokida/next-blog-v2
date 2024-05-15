import showdown from "showdown";
import parse from "html-react-parser";

import styles from "./PostContent.module.css";

interface ContentProps {
  content: Content;
}

export default function PostContent({ content }: ContentProps) {
  if (content.type === "text") {
    const converter = new showdown.Converter();
    const html = converter.makeHtml(content.text);
    return (
      <div className={styles.text} key={content.id}>
        {parse(html)}
      </div>
    );
  } else {
    return (
      <div className={styles.imageContainer} key={content.id}>
        <div className={styles.imageDiv}>
          <img
            className={styles.image}
            src={content.imageURL}
            alt={content.alt}
          />
        </div>
        {content.caption && <figcaption>{content.caption}</figcaption>}
      </div>
    );
  }
}
