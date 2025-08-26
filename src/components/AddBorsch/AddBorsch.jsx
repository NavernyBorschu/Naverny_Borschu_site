import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { ButtonVertion } from "../../components/ButtonVersion";
import { ReactComponent as IconClose } from "./close.svg";
import style from './AddBorsch.module.scss';

const API_KEY = process.env.REACT_APP_API_KEY_MAP;

// Формируем ссылку на фото (Places API v1)
const getPhotoUrl = (photo, maxWidth = 600) =>
  photo?.name
    ? `https://places.googleapis.com/v1/${photo.name}/media?key=${API_KEY}&maxWidthPx=${maxWidth}`
    : "";

export const AddBorsch = ({ onClose, placeData, place }) => {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [close, setClose] = useState("");
  const [open, setOpen] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    if (place?.hours) {
      setClose(place.hours.openNow ? "Відчинено" : "Зачинено");
      setOpen(place.hours.openNow ? "Закриється" : "Відкриється");
    }
    if (place?.hours?.nextCloseTime) {
      const date = new Date(place.hours.nextCloseTime);
      const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
      setCloseTime(time);
    }
    if (place?.hours?.nextOpenTime) {
      const date = new Date(place.hours.nextOpenTime);
      const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
      setCloseTime(time);
    }
  }, [place]);

  useEffect(() => {
    if (!placeData) return;

    setLoading(true);
    const timer = setTimeout(() => {
      const parts = placeData.split(",").map(p => p.trim());
      setStreet(parts.slice(0, 2).join(", "));
      setCity(parts[2] || "");
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [placeData]);

  const handleClose = () => {
    setStreet("");
    setCity("");
    setLoading(true);
    onClose();
  };

  const handleSelect = () => {
    navigate("/add-borsch/select-place", {
      state: {
        street,
        city,
        place
      },
    });
  };

  const photos = Array.isArray(place?.photos) ? place.photos.slice(0, 2) : [];

  return (
    <div className={style.container}>
      <div className={style.card}>
        <div className={style.boxClose}>
          <ButtonVertion type="button" onClick={handleClose} icon={IconClose} />
        </div>

        <div className={style.boxContext}>
          {loading ? (
            <p>Завантаження даних...</p>
          ) : (
            <div className={style.boxAddress}>
              <p className={style.name}>{place?.name}</p>
              <p className={style.street}>{place?.type}</p>
              <p className={style.street}>{street}</p>
              <p className={style.street}>{city}</p>

              <div className={style.box_time}>
                <p className={style.time}>{close}</p>
                {closeTime && <span className={style.close}>{open} о {closeTime}</span>}
              </div>


              {photos.length > 0 && (
                <div className={style.photos}>
                  {photos.map((ph, idx) => {
                    const src = getPhotoUrl(ph, 800); 
                    return (
                      <img
                        key={ph.name || idx}
                        src={src}
                        alt={`Фото ${place?.name || "закладу"} ${idx + 1}`}
                        className={style.photo}
                        loading="lazy"
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <Button
            type="button"
            name="Вибрати заклад"
            onClick={handleSelect}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};
