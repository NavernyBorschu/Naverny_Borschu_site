
import { useState, useEffect } from "react";
import { ReactComponent as IconGeo } from './geo_loc.svg';
import { ReactComponent as IconGeoActive } from './geoActive.svg';
import { Modal } from '../Modal/Modal';
import { ButtonVertion } from "../../components/ButtonVersion";
import { ReactComponent as IconClose } from './close.svg';
import style from './GeoButton.module.scss';

export const GeoButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [geoMessage, setGeoMessage] = useState(null);

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Авто-открытие модалки при первом запуске
  useEffect(() => {
    const hasCoords = !!localStorage.getItem("user_location");
    const forceUpdate = !!localStorage.getItem("force_update");
    const refusal = !!localStorage.getItem("refusal");

    if (!hasCoords && !forceUpdate && !refusal) {
      setShowModal(true);
    }
  }, []);

  const openModal = () => {
    const forceUpdate = !!localStorage.getItem("force_update");

    if (forceUpdate) {
      // если есть флаг force_update → сразу обновляем гео
      runGeolocation(true, isMobile);
    } else {
      // иначе показываем модалку
      setShowModal(true);
      setGeoMessage(null);
    }
  };

  const handleChoice = (choice) => {
    if (choice === "deny") {
      // пользователь отказался → очищаем localStorage
      localStorage.removeItem("user_location");
      localStorage.removeItem("force_update");
      localStorage.setItem("refusal", "true");
      setShowModal(false);
      return;
    }

    const forceUpdate = choice === "allow"; 
    setShowModal(false);

    if (!isMobile) {
      runGeolocation(forceUpdate);
    } else {
      runGeolocation(forceUpdate, true);
    }
  };

  const runGeolocation = (forceUpdate = false, useNative = false) => {
    if (!navigator.geolocation) {
      setGeoMessage({
        title: "Не вдалося визначити місцезнаходження.",
        sub_title: "Перевірте налаштування доступу до геолокації у браузері.",
        type: "error",
      });
      // очистка storage при ошибке
      localStorage.removeItem("user_location");
      localStorage.removeItem("force_update");
      localStorage.setItem("refusal", "true");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        localStorage.setItem("user_location", JSON.stringify(coords));

        if (forceUpdate) {
          localStorage.setItem("force_update", "true");
        }

        setGeoMessage(null);
        window.location.reload();
      },
      (error) => {
        console.error("Геолокація не визначена:", error);
        setGeoMessage({
          title: "Не вдалося визначити місцезнаходження.",
          sub_title: "Перевірте налаштування доступу до геолокації у браузері.",
          type: "error",
        });
        // очищаем storage при отказе/ошибке
        localStorage.removeItem("user_location");
        localStorage.removeItem("force_update");
        localStorage.setItem("refusal", "true");
      },
      useNative ? { enableHighAccuracy: true } : undefined
    );
  };

  const closeMessage = () =>{
    setGeoMessage(null);
    localStorage.setItem("refusal", "true");
  } 

  return (
    <div className={style.container}>
      <button type="button" className={style.btnGeo} onClick={openModal}>
        <IconGeo className={`${style.iconGeo} ${style.iconGeoDefault}`} />
        <IconGeoActive className={`${style.iconGeo} ${style.iconGeoHover}`} />
      </button>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className={style.modalContent}>
            <h4 className={style.title}>Доступ до місцезнаходження</h4>
            <div className={style.modalButtons}>
              <button className={style.modalBtn} onClick={() => handleChoice("allow")}>
                Коли додаток використовується
              </button>
              <button className={style.modalBtn} onClick={() => handleChoice("once")}>
                Лише цього разу
              </button>
              <button className={style.modalBtn} onClick={() => handleChoice("deny")}>
                Не дозволяти
              </button>
            </div>
          </div>
        </Modal>
      )}

      {geoMessage && (
        <Modal onClose={closeMessage}>
          <div className={`${style.geoMessage}`}>
            <div className={style.btnClose}>
              <ButtonVertion type="button" onClick={closeMessage} icon={IconClose} />
            </div>
            <h4 className={style.error_title}>{geoMessage.title}</h4>
            <span className={style.error_sub_titl}>{geoMessage.sub_title}</span>
          </div>
        </Modal>
      )}
    </div>
  );
};
