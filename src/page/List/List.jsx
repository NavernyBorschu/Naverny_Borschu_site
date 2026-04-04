import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ButtonVertion } from "../../components/ButtonVersion";
import { ReactComponent as IconLike } from './like.svg';
import { ReactComponent as IconLink } from './link.svg';
import { FotoBorschGallary } from "../../components/FotoBorschGallary";
import { RatingIconsSvg } from "../../components/RatingIconsSvg";
import { useBorsch } from '../../context/BorschContext';
import { usePlaces } from '../../context/PlacesContext';
import style from "./List.module.scss";

const fallbackCopy = (text) => {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
  console.log("Скопійовано через fallback:", text);  
};

export const List = () => {
  const navigate = useNavigate();
  const { getAllBorsch } = useBorsch();
  const { getPlaceById } = usePlaces();
  const [borschList, setBorschList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const all = await getAllBorsch();
      // Show only rated borsch (stored in localStorage)
      const ratedIds = JSON.parse(localStorage.getItem('ratedBorsch') || '[]');
      const filtered = ratedIds.length > 0 ? all.filter(b => ratedIds.includes(String(b.id_borsch))) : [];
      setBorschList(filtered);
      setLoading(false);
    };
    loadData();
  }, [getAllBorsch]);

  const onClickCard = (borschId) => {
    navigate(`/#/borsch/${borschId}`);
  };

  const nameBorsch = (place_id) => {
    const place = getPlaceById(place_id);
    return place ? place.name : "Невідоме місце";
  };

  const handleCopyAndShare = (id_borsch) => {
  const url = `${window.location.origin}/#/borsch/${id_borsch}`;

  
  if (navigator.share) {
    navigator.share({
      title: 'Перегляньте цей борщ',
      text: 'Дивись ось цю сторінку борща:',
      url: url,
    })
    .then(() => console.log("Поділитися успішно"))
    .catch((err) => {
      console.error("Помилка при шерингу:", err);
    
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          alert("Посилання скопійоване в буфер. Поділитись можна вручну.");
        });
      } else {
        fallbackCopy(url);
      }
    });
  } else {
   
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        alert("Посилання скопійоване в буфер. Поділитись можна вручну.");
      });
    } else {
      fallbackCopy(url);
    }
  }
  };



  return (
    <div className={style.page}>
      <h2 className={style.title}>Мої відгуки</h2>
      {loading && <p>Завантаження...</p>}
      {!loading && borschList.length === 0 && (
        <div style={{ padding: '32px 16px', textAlign: 'center', opacity: 0.6 }}>
          <p style={{ fontSize: 32 }}>📝</p>
          <p>Поки немає відгуків</p>
          <p style={{ fontSize: 13 }}>Оцініть борщ, і вони з’являться тут</p>
        </div>
      )}
      <div className={style.wrappBorsch}>
        {borschList.map((el, index) => (
          <div key={index} className={style.card}>
            <FotoBorschGallary images={el.photo_urls} height={"120px"} />
            <div className={style.box}>
              <ButtonVertion
                type="button"
                onClick={() => handleCopyAndShare(el.id_borsch)}
                icon={IconLink}
              />
              <ButtonVertion
                type="button"
                onClick={() => console.log("Функція зміни лайка")}
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
        ))}
      </div>
    </div>
  );
};
