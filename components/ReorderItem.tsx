import React from "react";
import { Reorder } from "framer-motion";

import styles from "./ReorderItem.module.css";
import Markdown from "marked-react";
import Image from "next/image";

interface ReorderItemProps {
  type: "text" | "image";
  value: any;
  index: number;
  caption?: "string";
  handleRemoveContent: (index: number) => void;
  handleEditContent?: () => {};
}

const ReorderItem = ({
  type,
  value,
  index,
  handleRemoveContent,
  handleEditContent,
}: ReorderItemProps) => {
  const text = value.text;

  if (type === "text" && text) {
    return (
      <Reorder.Item key={value.id} value={value} className={styles.item}>
        <Markdown>{text}</Markdown>
        <button
          className={styles.delete}
          onClick={() => handleRemoveContent(index)}
        >
          ❎
        </button>
      </Reorder.Item>
    );
  }

  if (type === "image") {
    return (
      <Reorder.Item key={value.id} value={value} className={styles.item}>
        <div>
          <Image
            className={styles.img}
            src={
              value.imageUrl
                ? value.imageUrl
                : URL.createObjectURL(value.tempImageFile)
            }
            alt="item temporary"
          />
          <br />
          {value.caption && <span>{value.caption}</span>}
        </div>
        <button
          className={styles.delete}
          onClick={() => handleRemoveContent(index)}
        >
          ❎
        </button>
      </Reorder.Item>
    );
  }
};

export default ReorderItem;
