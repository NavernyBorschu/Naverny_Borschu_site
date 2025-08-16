import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button";
import { ReactComponent as IconClose } from "./close.svg";
import { ReactComponent as Logo } from "./logo.svg";
import { ButtonVertion } from "../../components/ButtonVersion";
import style from "./CardSaveEvalutions.module.css";
import typography from "../../styles/typography.module.css";

export const CardSaveEvalutions = ({ onClose, onSubmit, disabled, isSent }) => {
  const [spin, setSpin] = useState(false);

  
  useEffect(() => {
    setSpin(true);
    const t = setTimeout(() => setSpin(false), 1000); 
    return () => clearTimeout(t);
  }, []);

  
  const handleSubmit = (e) => {
    e.preventDefault(); 
    setSpin(true);
    setTimeout(() => setSpin(false), 1000);
    onSubmit && onSubmit(e); 
  };

  return (
    <div className={style.container}>
      <div className={style.card}>
        {!isSent && (
          <div className={style.boxClose}>
            <ButtonVertion type="button" onClick={onClose} icon={IconClose} />
          </div>
        )}
        <div className={style.boxContext}>
          <Logo className={spin ? style["spin-once"] : ""} />
          {isSent && <p className={style.title}>Дякуємо за відгук!</p>}
          {!isSent && (
            <p className={typography.mobileH3}>
              Зберегти оцінку перед переходом?
            </p>
          )}
          {!isSent && (
            <p className={typography.mobileCaption}>
              Твої оцінки ще не збережено. Якщо вийдеш зараз — вони зникнуть.
            </p>
          )}
          {isSent && (
            <p className={typography.mobileCaption}>
              Ми його вже помішуємо - подамо після модерації
            </p>
          )}
          {!isSent && (
            <Button
                type="submit" // оставляем submit
                name="Зберегти і перейти"
                onClick={handleSubmit}
                disabled={disabled}
            />
          )}
          {!isSent && (
            <Link to="/" className={style.link}>
              Покинути сторінку
            </Link>
          )}
          {isSent && (
            <Link to="/" className={style.linkInl}>
              Повернутись на головну
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
