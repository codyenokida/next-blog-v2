import styles from "./PostPreviewSkeleton.module.css";

export default function PostPreviewSkeleton({ id }: PostPreviewSkeletonProps) {
  return (
    <div className={styles.item} key={id}>
      <div className={styles.image}>
        <div className={styles.skeleton} />
      </div>
      <div className={styles.title}>
        <div className={styles.skeleton} />
      </div>
      <div className={styles.preview}>
        {[1, 2, 3, 4].map((i) => (
          <div className={styles.text} key={i}>
            <div className={styles.skeleton} />
          </div>
        ))}
      </div>

      <div className={styles.date}>
        <div className={styles.skeleton} />
      </div>
    </div>
  );
}
