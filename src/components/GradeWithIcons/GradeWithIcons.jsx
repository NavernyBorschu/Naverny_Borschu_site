import { useState, useRef, useEffect } from "react";
import style from "./GradeWithIcons.module.css";

export const GradeWithIcons = ({
  title = "Оцінка",
  iconLabels = [null, null], 
  defaultValue = 5,
  onChange, 
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
  
      <div className={style.wrap}>
        <label className={style.labelCenter}>
          <div className={style.title}>{title}</div>
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

          <div className={style.iconLabels}>
            <span>{iconLabels[0]}</span>
            <span>{iconLabels[1]}</span>
          </div>
        </label>
      </div>
    
  );
};
