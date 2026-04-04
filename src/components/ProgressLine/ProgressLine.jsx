import styles from "./ProgressLine.module.scss";

export const ProgressLine = ({ title, icon: Icon, value }) => {
  const maxValue = 10;
  // Handle non-numeric values (like "—")
  const numericValue = parseFloat(value);
  const displayValue = isNaN(numericValue) ? value : numericValue;
  const percent = isNaN(numericValue) ? 0 : Math.min(Math.max(numericValue, 0), maxValue) * 10;

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
