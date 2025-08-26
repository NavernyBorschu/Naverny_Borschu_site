import { Link } from "react-router-dom";
import { Button } from "../../components/Button";
import { ReactComponent as IconClose } from "./close.svg";
import { ReactComponent as Logo } from "./logo.svg";
import { ButtonVertion } from "../../components/ButtonVersion";
import style from "./CardSaveEvalutions.module.scss";


export const CardSaveEvalutions = ({ onClose, onSubmit, disabled, isSent }) => {
 
  return (
    <div className={style.container}>
      <div className={style.card}>
        {!isSent && (
          <div className={style.boxClose}>
            <ButtonVertion type="button" onClick={onClose} icon={IconClose} />
          </div>
        )}
        <div className={style.boxContext}>
          <Logo className={style.spin_once} />
          {isSent && <h3 className={style.title}>Дякуємо за відгук!</h3>}
          {!isSent && (
            <h3 className={style.title}>
              Зберегти оцінку перед переходом?
            </h3>
          )}
          {!isSent && (
            <p className={style.subTitle}>
              Твої оцінки ще не збережено. Якщо вийдеш зараз — вони зникнуть.
            </p>
          )}
          {isSent && (
            <p className={style.subTitle}>
              Ми його вже помішуємо - подамо після модерації
            </p>
          )}
          {!isSent && (
            <Button
                type="submit" 
                name="Зберегти і перейти"
                onClick={onSubmit}
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
