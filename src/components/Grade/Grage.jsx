import { useState, useRef, useEffect } from "react";
import style from "./Grade.module.scss";

export const Grade = ({ 
  icon: Icon, 
  title = "Оцінка", 
  labels = ["мінімум", "максимум"], 
  defaultValue = 5,
  onChange, 
  index
}) => {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef(null);

  useEffect(() => {
    const percent = ((value - 1) / 9) * 100;
    if (inputRef.current) {
      inputRef.current.style.setProperty("--value", `${percent}%`);
    }
  }, [value]);

  const handleChange = (e) => {
    const newVal = Number(e.target.value);
    setValue(newVal);
    if (onChange) onChange(newVal);
  };

  return (
    <div className={style.container} key={index}>
      <div className={style.wrap}>
        {Icon && <Icon aria-label={`icon-${title}`} />}
        <label className={style.label}>
          {title}
          <div className={style.sliderWrapper}>
            <div className={style.track}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`${style.tick} ${i < value ? style.filled : ''}`}
                />
              ))}
            </div>
            <input
              ref={inputRef}
              type="range"
              min="1"
              max="10"
              value={value}
              onChange={handleChange}
              className={style.input}
            />
          </div>
          <div className={style.text}>
            <p>{labels[0]}</p>
            <p>{labels[1]}</p>
          </div>
        </label>
      </div>
    </div>
  );
};
