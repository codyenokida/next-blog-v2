import Link from "next/link";
import Image from "next/image";

import { formatDate } from "@/utils/helper";

import styles from "./PostItem.module.css";

export default function PostItem({
  id,
  datePosted,
  thumbnailURL,
  title,
  preview,
}: PostItemProps) {
  return (
    <Link className={styles.item} key={id} href={`/post/${id}`}>
      <div className={styles.image}>
        <Image
          src={thumbnailURL}
          alt={`${title} thumbnail`}
          width={540}
          height={540}
          priority
        />
      </div>
      <div className={styles.text}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.preview}>{preview}</p>
        <p className={styles.date}>{formatDate(datePosted.toDate())}</p>
        {/* <Link className={styles.link} key={id} href={`/post/${id}`}>
          Read here ↦
        </Link> */}
      </div>
    </Link>
  );
}
