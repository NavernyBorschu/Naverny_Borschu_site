import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ReactComponent as IconDelete } from './close.svg';
import { ReactComponent as IconLikeInl } from './like_inl.svg';
import { RatingIconsSvg } from "../RatingIconsSvg";
import { FotoBorschGallary } from "../../components/FotoBorschGallary";
import borsch from '../../data/borsch.json';
import style from './Gallery.module.css';

export const Gallery = ({ onClose, id_place, place }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const arrayBorsch = borsch.filter(i => i.place_id === id_place);
  const navigate = useNavigate();

  const cardStyle = (isActive) => ({
    width: isActive ? "220px" : "180px",
    height: isActive ? "280px" : "220px",
    margin: isActive ? "0 -20px" : "0",
    padding: "6px",
    flexShrink: 0,
    transform: isActive ? "scale(1.0) translateY(-10px)" : "scale(0.9)",
    opacity: isActive ? 1 : 0.5,
    transition: "all 0.5s ease",
    position: "relative",
    zIndex: isActive ? 2 : 1,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.3)",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#fff",
  });

  const onClickCard = (borschId) => {
    navigate(`/borsch/${borschId}`);
  };

  return (
    <div className={style.container}>
      <div
        className={style.row}
        style={{ transform: `translateX(-${activeIndex * 200}px)` }}
      >
        {arrayBorsch.map((borsch, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={index}
              className={style.card}
              style={cardStyle(isActive)}
              onClick={() => setActiveIndex(index)}
            >
              <div className={style.box}>
                <button
                  type="button"
                  onClick={onClose}
                  className={style.closeButton}
                >
                  <IconDelete className={style.icon} aria-label={'close'} id='close' />
                </button>
                <IconLikeInl />
              </div>
              <FotoBorschGallary images={borsch.photo_urls} />
              <p className={style.borschName}>{borsch.name}</p>
              <div className={style.flex}>
                <p>{borsch.price}</p>
                <p>{borsch.weight}</p>
              </div>
              <RatingIconsSvg overall_rating={borsch.overall_rating} />
              <div className={style.flex}>
                <p>{place.name}</p>
                <button
                  type="button"
                  onClick={() => onClickCard(borsch.id_borsch)}
                  className={style.closeButton}
                >
                  ...
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
