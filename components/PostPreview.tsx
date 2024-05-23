import Link from "next/link";
import Image from "next/image";
import { getPlaiceholder } from "plaiceholder";

import { formatDate } from "@/utils/helper";

import styles from "./PostPreview.module.css";

export default async function PostPreview({
  id,
  datePosted,
  thumbnailURL,
  title,
  preview,
  index,
}: PostPreviewProps) {
  const response = await fetch(thumbnailURL);
  const arrayBuffer = await response.arrayBuffer();

  const { base64 } = await getPlaiceholder(Buffer.from(arrayBuffer));

  return (
    <Link
      className={styles.item}
      key={id}
      href={`/post/${id}`}
      style={{
        animationDuration: `${0.3 + (1 + index) * 0.2}s`,
      }}
    >
      <div className={styles.image}>
        <Image
          src={thumbnailURL}
          alt={`${title} thumbnail`}
          width={540}
          height={540}
          blurDataURL={base64}
        />
      </div>
      <div className={styles.text}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.preview}>{preview}</p>
        <p className={styles.date}>{formatDate(datePosted.toDate())}</p>
      </div>
    </Link>
  );
}
