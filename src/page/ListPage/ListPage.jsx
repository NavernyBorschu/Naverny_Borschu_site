import {Link, useNavigate} from "react-router-dom";
import { useEffect } from 'react';
import { Filters } from '../../components/Filters/Filters';
import { RatingIconsSvg } from "../../components/RatingIconsSvg";
import { ButtonVertion } from "../../components/ButtonVersion";
import { ReactComponent as IconLike } from './like.svg';
import { ReactComponent as IconLink } from './link.svg';
import { FotoBorschGallary } from "../../components/FotoBorschGallary";
import { usePlaces } from '../../context/PlacesContext';
import { useBorsch } from '../../context/BorschContext';
import { useFilters } from '../../context/FiltersContext';
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
  const { places, updatePlacesBySearch } = usePlaces();
  const { borsch } = useBorsch();
  const { filters, clearSearchQuery } = useFilters();
  
  const onClickCard = (borschId) => {
    navigate(`/borsch/${borschId}`);
  };
  
  const nameBorsch=(place_id)=>{  
    const place = places.find(i => String(i.id) === String(place_id));   
    return place ? place.name : "Невідоме місце";
  }

  // Синхронизация с фильтрами - обновляем места при изменении поиска
  useEffect(() => {
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      updatePlacesBySearch(filters.searchQuery);
    } else {
      updatePlacesBySearch('');
    }
  }, [filters.searchQuery, updatePlacesBySearch]); 
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
        <div className={style.containerFilter}> 
          <Filters/>  
          <div className={style.btnWrap}> 
            <Link to="/"  className={style.btn}>Мапа</Link>          
            <Link to="/list"  className={style.btn_inl}>Список</Link>               
          </div>
              <div className={style.borsch}>(зареєстровано {borsch?.length || 0} борщів)</div>
        </div>
        <div className={style.wrappBorsch}>
            {(() => {
              const filteredBorsch = borsch?.filter(el => {                
                return places.some(place => String(place.id) === String(el.place_id));
              });              
                if (filteredBorsch && filteredBorsch.length === 0) {
                 return (
                   <div className={style.noResults}>
                     <button 
                       className={style.closeButton}
                       onClick={() => clearSearchQuery()}
                       aria-label="Закрити повідомлення"
                     >
                       ×
                     </button>
                     За вашим запитом жодного борща не знайдено
                   </div>
                 );
               }
              
              return filteredBorsch?.map((el,index)=>{                   
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
                    <p className={style.grade}>Моя оцінка</p>
                    <RatingIconsSvg overall_rating={el.overall_rating} /> 
                    <div className={style.flex}>
                      <p className={style.namePlace}>{nameBorsch(el.place_id)}</p>
                      <button
                        className={style.btnAbout}
                        type="button"
                        onClick={() => onClickCard(el.id_borsch)}
                      >Про борщик</button>                      
                    </div>                    
                  </div>
                )                    
              });
            })()} 
        </div>         
      </div>
    )   
  }