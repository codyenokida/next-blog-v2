import Link from "next/link";
import Image from "next/image";

import { formatDate } from "@/utils/helper";

import styles from "./PostPreview.module.css";

export default function PostPreview({
  id,
  datePosted,
  thumbnailURL,
  title,
  preview,
}: PostPreviewProps) {
  return (
    <Link className={styles.item} key={id} href={`/post/${id}`}>
      <div className={styles.image}>
        <Image
          src={thumbnailURL}
          alt={`${title} thumbnail`}
          width={200}
          height={200}
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
