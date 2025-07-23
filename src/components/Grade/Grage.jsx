import  { useState, useRef, useEffect  } from "react";
import style from "./Grade.module.css"

const comments = {
  1: "Жахливо",
  2: "Дуже погано",
  3: "Погано",
  4: "Слабо",
  5: "Середньо",
  6: "Непогано",
  7: "Добре",
  8: "Дуже добре",
  9: "Відмінно",
  10: "Чудово",
};

export const Grade = () => {
  const [value, setValue] = useState(5);
  const inputRef = useRef(null);
  
useEffect(() => {
    const percent = ((value - 1) / 9) * 100; 
    if (inputRef.current) {
      inputRef.current.style.setProperty("--value", `${percent}%`);
    }
  }, [value]);
  return (
    <div className={style.wrap}>      
      <label className={style.label}>
        {comments[value]}
         <div className={style.scale}>
        {/* {comments.map((text, i) => (
          <span
            key={i}
            className={`${style.mark} ${value === i + 1 ? style.active : ""}`}
          >
            {text}
          </span>
        ))} */}
      </div>
        <input
          type="range"
          min="1"
          max="10"
          value={value}         
          onChange={(e) => setValue(Number(e.target.value))} 
          className={style.input}      
      />    
      </label>    
      <p>
        {value} / 10
      </p>
    </div>
  );
};

