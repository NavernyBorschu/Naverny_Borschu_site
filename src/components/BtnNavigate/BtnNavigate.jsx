import { useNavigate } from "react-router-dom";
import { ReactComponent as IconNavigate } from './Button.svg';
import style from './BtnNavigate.module.css';

export const BtnNavigate = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)} className={style.btn}>
      <IconNavigate />      
    </button>
  );
};