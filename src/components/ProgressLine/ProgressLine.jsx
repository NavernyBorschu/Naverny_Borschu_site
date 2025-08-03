import styles from "./ProgressLine.module.css";

export const ProgressLine = ({ title, icon: Icon, value }) => {
  const maxValue = 10;
  const percent = Math.min(Math.max(value, 0), maxValue) * 10;

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{title}</div>
      <div className={styles.row}>
        {Icon && <Icon className={styles.icon} />}
        <div className={styles.trackWrapper}>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${percent}%` }} />
          </div>
          <span className={styles.value}>({value})</span>
        </div>
      </div>
    </div>
  );
};
