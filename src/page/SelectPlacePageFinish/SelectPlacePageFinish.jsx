import { useState, useRef } from 'react';
import { BtnNavigate } from "../../components/BtnNavigate/BtnNavigate";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ReactComponent as IconMapPin } from './map-pin.svg';
import { Button } from "../../components/Button";
import style from "./SelectPlacePageFinish.module.scss";

const meatOptions = ['Без м\'яса', 'Курка', 'Свинина', 'Яловичина', 'Інше'];

export const SelectPlacePageFinish = () => {
  const { borschId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [newBorsch, setNewBorsch] = useState({
    id_borsch: borschId,
    name: null,
    place_id: "генерується",
    meat: null,
    price: null,
    weight: null,
    photo_urls: []
  });

  if (!state) {
    return (
      <div className={style.containerPage}>
        <BtnNavigate />
        <p>Дані відсутні. Поверніться назад і виберіть заклад.</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBorsch((prev) => ({ ...prev, [name]: value }));
  };

  const handleMeatSelect = (meat) => {
    setNewBorsch((prev) => ({ ...prev, meat }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileUrls = files.map(file => URL.createObjectURL(file));
    setNewBorsch((prev) => ({
      ...prev,
      photo_urls: [...prev.photo_urls, ...fileUrls]
    }));
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const isFormValid = Object.values(newBorsch).every((val) => val !== null && val !== "");

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    const data = { ...newBorsch };
    // todo відправка на сервер
    console.log("Відправлено:", data);
    navigate("/");
  };

  const { place, street, city } = state;

  return (
    <div className={style.containerPage}>
      <BtnNavigate />
      <div className={style.container}>        
        <h4 className={style.title}>{place.name}</h4>
      <div className={style.wrapp}>
        <IconMapPin />
        <p>{street}, місто {city}</p>
      </div>
      <form onSubmit={handleSubmitForm}>        
        <div className={style.uploadBox}>            
          <button 
            type="button" 
            className={style.uploadBtn}
            onClick={handleUploadClick}
          >
            Завантажити фото борщу
          </button>
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>       
        {newBorsch.photo_urls.length > 0 && (
          <div className={style.previewBox}>
            {newBorsch.photo_urls.map((src, idx) => (
              <img key={idx} src={src} alt={`борщ ${idx}`} className={style.previewImg}/>
            ))}
          </div>
        )}

        <div className={style.inputsBox}>
          <label className={style.label}>
            <span className={style.text}>Назва борщу</span>
            <input
              type="text"
              name="name"
              value={newBorsch.name || ""}
              onChange={handleInputChange}
              className={style.input}
              placeholder="Введіть назву борщу"
            />
          </label>
          <label className={style.label}>
            <span className={style.text}>Ціна борщу</span>
            <input
              type="number"
              name="price"
              value={newBorsch.price || ""}
              onChange={handleInputChange}
              className={style.input}
              placeholder="Введіть ціну у гривнях"
            />
          </label>
          <label className={style.label}>
            <span className={style.text}>Порція, г</span>
            <input
              type="number"
              name="weight"
              value={newBorsch.weight || ""}
              onChange={handleInputChange}
              className={style.input}
              placeholder="Введіть вагу борщу"
            />
          </label>
        </div>

        <div className={style.boxType}>
          <h3 className={style.typeTitle}>Тип мʼяса</h3>
          <div className={style.meatOptions}>
            {meatOptions.map((meat) => (
              <button
                key={meat}
                type="button"
                className={`${style.meatButton} ${newBorsch.meat === meat ? style.activeMeatButton : ''}`}
                onClick={() => handleMeatSelect(meat)}
              >
                {meat}
              </button>
            ))}
          </div>
        </div>
        <Button
          type="submit"
          name="Продовжити"
          disabled={!isFormValid}
        />
      </form>
      </div>     
      
    </div>
  );
};
