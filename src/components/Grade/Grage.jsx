import { useState, useRef, useEffect } from "react";
// import { ReactComponent as Beetroot } from "./beetroot.svg";
// import { ReactComponent as Salt } from "./salt.svg";
import { ReactComponent as Meat } from "./meat.svg";
import { ReactComponent as Smile1 } from "./smile1.svg";
import { ReactComponent as Smile2 } from "./smile2.svg";
import { ReactComponent as Smile3 } from "./smile3.svg";
import { ReactComponent as Smile4 } from "./smile4.svg";
import { ReactComponent as Smile5 } from "./smile5.svg";
import style from "./Grade.module.css";

const comments = {
  1: <Smile1   aria-label='icon-smile1' id='smile1'/>,
  2: <Smile1  aria-label='icon-smile1' id='smile1'/>,
  3: <Smile2 aria-label='icon-smile2' id='smile2'/>,
  4: <Smile2 aria-label='icon-smile2' id='smile2'/>,
  5: <Smile3  aria-label='icon-smile3' id='smile3'/>,
  6: <Smile3  aria-label='icon-smile3' id='smile3'/>,
  7: <Smile3  aria-label='icon-smile4' id='smile4'/>,
  8: <Smile4  aria-label='icon-smile4' id='smile4'/>,
  9: <Smile5 aria-label='icon-smile5' id='smile5'/>,
  10: <Smile5  aria-label='icon-smile5' id='smile5'/>,
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
    <div className={style.container}>
      {/* <div className={style.wrap}>
        <Beetroot aria-label='icon-beetroot' id='beetroot'/>
        <label className={style.label}>
          <div className={style.sliderWrapper}>
            <div
              className={style.icon}
              style={{ left: `calc(${(value - 1) * 11.11}%` }} // <-- фикс: закрой скобку
            >
              {comments[value]}
            </div>
            <input
              ref={inputRef}
              type="range"
              min="1"
              max="10"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className={style.input}
            />
          </div>
        </label>
        <p className={style.text}>({value})</p>
      </div> */}
      <div className={style.wrap}>
        <Meat aria-label='icon-meat' id='meat'/>
        <label className={style.label}>М'ясовитість
          <div className={style.sliderWrapper}>
            <div className={style.track}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`${style.tick} ${i < value ? style.filled : ''}`}
                />
              ))}
            </div>
            <div  className={style.thumbIcon}  style={{ left: `calc(${(value) * 10}% - 20px)` }} >
              {comments[value]}
            </div>
            <input
              ref={inputRef}
              type="range"
              min="1"
              max="10"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className={style.input}
            />
          </div>
          <div className={style.text}>
            <p>жодного шматочка</p>
            <p>у кожній ложці</p>
          </div>
         
         
        </label>
        
      </div>
    </div>
  );
};