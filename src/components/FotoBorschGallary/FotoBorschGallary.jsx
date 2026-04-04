import { useState } from 'react';
import style from './FotoBorschGallary.module.css';

export const FotoBorschGallary = ({ images, height}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };


  if (!images || images.length === 0) return null;

  return (
    <div className={style.gallery}>
      <div style={{height:`${height}`}}>        
        <img
          src={images[currentIndex]?.startsWith('http') ? images[currentIndex] : `https://map.navernyborshchu.com${images[currentIndex]}`}
          alt={images[currentIndex]?.split('/').pop() || 'Фото борща'}
          className={style.image}
        />       
        <div className={style.dots}>
          {images.map((_, index) => (
            <span
              key={index}
              className={`${style.dot} ${index === currentIndex ? style.active : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
