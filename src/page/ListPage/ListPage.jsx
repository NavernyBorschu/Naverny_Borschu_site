import {Link, useNavigate} from "react-router-dom";
import { Filters } from '../../components/Filters/Filters';
import { RatingIconsSvg } from "../../components/RatingIconsSvg";
import { ButtonVertion } from "../../components/ButtonVersion";
import { ReactComponent as IconLike } from './like.svg';
import { ReactComponent as IconLink } from './link.svg';
import { ReactComponent as IconDitail } from './ditail.svg';
import { FotoBorschGallary } from "../../components/FotoBorschGallary";
import borsch from '../../data/borsch.json';
import data from '../../data/places.json';
import style from './ListPage.module.scss';
// запит на сервер додати
const fallbackCopy = (text) => {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
  console.log("Скопійовано через fallback:", text);
};

export const ListPage=()=>{
  const navigate = useNavigate();
  const onClickCard = (borschId) => {
    navigate(`/borsch/${borschId}`);
  };
  const nameBorsch=(place_id)=>{  
    const place = data.find(i => String(i.id) === String(place_id));   
    return place ? place.name : "Невідоме місце";
  } 
  const handleCopyAndShare = (id_borsch) => {
    const url = `${window.location.origin}/borsch/${id_borsch}`;

    // Если Web Share API поддерживается — вызываем нативное окно
    if (navigator.share) {
      navigator.share({
        title: 'Перегляньте цей борщ',
        text: 'Дивись ось цю сторінку борща:',
        url: url,
      })
      .then(() => console.log("Поділитися успішно"))
      .catch((err) => {
        console.error("Помилка при шерингу:", err);
        // Если шеринга нет или отказались — копируем в буфер один раз
        copyToClipboardWithAlert(url);
      });
    } else {
      // Web Share API нет — просто копируем в буфер и alert
      copyToClipboardWithAlert(url);
    }
  };

  const copyToClipboardWithAlert = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          alert("Посилання скопійоване в буфер. Поділитись можна вручну.");
        })
        .catch((err) => {
          console.error("Помилка копіювання:", err);
          fallbackCopy(text);
          alert("Посилання скопійоване в буфер. Поділитись можна вручну.");
        });
    } else {
      fallbackCopy(text);
      alert("Посилання скопійоване в буфер. Поділитись можна вручну.");
    }
  };
    return( 
      <div className={style.pageList}>
        <> 
          <Filters/>  
          <div className={style.btnWrap}> 
            <Link to="/"  className={style.btn}>Мапа</Link>          
            <Link to="/list"  className={style.btn_inl}>Список</Link>               
          </div>
          <div className={style.borsch}>(зареєстровано {borsch.length} борщів)</div>
        </>
        <div className={style.wrappBorsch}>
            {borsch.map((el,index)=>{                   
              return (
                <div key={index} className={style.card}>
                  <FotoBorschGallary images={el.photo_urls} height={"120px"}/>                  
                  <div className={style.box}>                
                    <ButtonVertion
                      type="button"
                      onClick={() => handleCopyAndShare(el.id_borsch)}
                      icon={IconLink}
                    />
                    <ButtonVertion
                        type="button"
                        onClick={()=>console.log("Тут буде функція яка змінює ключ лайку")}
                        icon={IconLike}
                    />
                  </div>                  
                  <div className={style.flex}>
                    <p className={style.borschName}>{el.name}</p>
                    <p className={style.borschPrice}>{el.price}</p>                    
                  </div>
                  <RatingIconsSvg overall_rating={el.overall_rating} /> 
                  <div className={style.flex}>
                    <p className={style.namePlace}>{nameBorsch(el.place_id)}</p>
                    <ButtonVertion
                      type="button"
                      onClick={() => onClickCard(el.id_borsch)}
                      icon={IconDitail}
                    />
                  </div>
                  
                </div>
              )                    
            })} 
        </div>
         
      </div>
    )   
  }