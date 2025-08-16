import { useState } from 'react';
import style from './FotoBorschGallary.module.css';

export const FotoBorschGallary = ({ images, height}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };


  return (
    <div className={style.gallery}>
      <div style={{height:`${height}`}}>        
        <img
          src={`/${images[currentIndex]}`}
          alt={`Slide ${currentIndex}`}
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
