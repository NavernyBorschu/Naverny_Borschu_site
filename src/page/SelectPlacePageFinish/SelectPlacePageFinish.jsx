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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

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

  const isFormValid = newBorsch.name && newBorsch.meat;

  const API_BASE = process.env.REACT_APP_API_URL || 'https://api.navernyborshchu.com/api';

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!isFormValid || submitting) return;
    setSubmitting(true);
    setSubmitError('');

    try {
      // Step 1: Create or find place
      let placeId = null;
      const searchRes = await fetch(`${API_BASE}/places/?search=${encodeURIComponent(place.name)}`);
      const searchData = await searchRes.json();
      const existing = (searchData.results || []).find(p => p.name === place.name);

      if (existing) {
        placeId = existing.id;
      } else {
        const placeRes = await fetch(`${API_BASE}/places/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: place.name,
            address: `${street}, ${city}`,
            city: city,
            type: place.type || '',
            latitude: place.location?.lat || 0,
            longitude: place.location?.lng || 0,
          }),
        });
        if (!placeRes.ok) throw new Error('Не вдалося створити заклад');
        const placeData = await placeRes.json();
        placeId = placeData.id;
      }

      // Step 2: Create borsch
      const borschRes = await fetch(`${API_BASE}/borsches/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBorsch.name,
          place: placeId,
          type_meat: newBorsch.meat,
          price: newBorsch.price ? parseFloat(newBorsch.price) : null,
          grams: newBorsch.weight ? parseInt(newBorsch.weight) : null,
          date: new Date().toISOString(),
        }),
      });
      if (!borschRes.ok) throw new Error('Не вдалося додати борщ');
      const borschData = await borschRes.json();

      // Notify context to refresh
      window.dispatchEvent(new Event('borschDataUpdated'));
      navigate(`/#/borsch/${borschData.id}`);
    } catch (err) {
      setSubmitError(err.message || 'Помилка. Спробуйте ще раз.');
    } finally {
      setSubmitting(false);
    }
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
        {submitError && <p style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>{submitError}</p>}
        <Button
          type="submit"
          name={submitting ? 'Зберігаємо...' : 'Додати борщ'}
          disabled={!isFormValid || submitting}
        />
      </form>
      </div>     
      
    </div>
  );
};
