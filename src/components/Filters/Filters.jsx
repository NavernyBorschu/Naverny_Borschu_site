import { useState, useCallback } from 'react';
import { ReactComponent as IconSearch } from './search.svg';
import { ReactComponent as IconSearchGray } from './searchGray.svg';
import { ReactComponent as IconFilter } from './filter.svg';
import { ReactComponent as IconFilterActive } from './filterActive.svg';
import { ReactComponent as IconGeo } from './geo_loc.svg';
import { ReactComponent as IconGeoActive } from './geoActive.svg';
import { Modal } from '../Modal/Modal';
import { CardFilters } from '../CardFilters/CardFilters';
import style from "./Filters.module.css";


export const Filters = () => {
  const [isActiveFilter, setIsActiveFilter] = useState(false);
  const [geoMessage, setGeoMessage] = useState(null);

  const changeIsActiveFilter = useCallback(() => {
    setIsActiveFilter((prev) => !prev);
  }, []);

  const handleGeoClick = () => {
  const savedCoords = localStorage.getItem('user_location');

  if (savedCoords) {
    setGeoMessage({
      text: "Геоданні вже були успішно встановлені та відображені на мапі",
      type: "success",
    });
    return;
  }

  if (!navigator.geolocation) {
    setGeoMessage({
      text: "Геолокація не підтримується вашим браузером.",
      type: "error"
    });
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      localStorage.setItem('user_location', JSON.stringify(coords));
      setGeoMessage({
        text: "Геодані успішно встановлені",
        type: "success"
      });
        setTimeout(() => {
        window.location.reload();
        }, 2000);    
    },
    (error) => {
      console.error("Помилка геолокації:", error);
      setGeoMessage({
        text: "Не можливо встановити геолокацію. Перевірте налаштування браузера з дозволу геоданих та спробуйте ще раз",
        type: "error"
      });
    });
  };

  const closeGeoMessage = () => {    
    setGeoMessage(null);
  };

  return (
    <div className={style.filterWrap}>
      <div className={style.inputWrap}>
        <button
          type="submit"
          className={style.searchButton}
          aria-label="search"
        >
          <IconSearch className={`${style.icon} ${style.iconDefault}`} />
          <IconSearchGray className={`${style.icon} ${style.iconActive}`} />
        </button>
        <input
          className={style.input}
          type="text"
          id="search"
          placeholder="Введіть назву закладу"
        />
      </div>
      <button
        type="button"
        className={style.btnFilter}
        onClick={changeIsActiveFilter}
        id="filter"
      >
        <IconFilter className={`${style.iconFilter} ${style.iconFilterDefault}`} />
        <IconFilterActive className={`${style.iconFilter} ${style.iconFilterHover}`} />
      </button>
      <button
        type="button"
        className={style.btnGeo}
        id="geo"
        onClick={handleGeoClick}
      >
        <IconGeo className={`${style.iconGeo} ${style.iconGeoDefault}`} />
        <IconGeoActive className={`${style.iconGeo} ${style.iconGeoHover}`} />        
      </button>

      {isActiveFilter && (
        <Modal onClose={changeIsActiveFilter} version={"filters"}>
          <CardFilters onClose={changeIsActiveFilter} />
        </Modal>
      )}

      {geoMessage && (
        <div
          className={`${style.geoMessage} ${style[geoMessage.type]}`}
        >
          <span>{geoMessage.text}</span>
          <button onClick={closeGeoMessage} className={style.closeBtn}>
            ✖
          </button>
        </div>
      )}
    </div>
  );
};
