import  { useState } from "react";
import { ReactComponent as IconDelete } from './close.svg';
// import { ReactComponent as IconLike } from './like.svg';
import { ReactComponent as IconLikeInl } from './like_inl.svg';
import { RatingIconsSvg } from "../RatingIconsSvg";
import borsch from '../../data/borsch.json';
// import data from '../../data/places.json';




export const Gallery=({onClose,id_place,place})=> {
  const [activeIndex, setActiveIndex] = useState(0);
  const arrayBorsch = borsch.filter(i => i.place_id === id_place);
  
  
  const containerStyle = {
    width: "100vw",   
    overflow: "visible",
    position: "relative"    
  };

  const rowStyle = {
    display: "flex",
    transition: "transform 0.5s ease",
    transform: `translateX(-${activeIndex * 200}px)`,
    alignItems: "center",
    position: "relative",
    marginLeft:"-90px"
  };
  const box={
    position: "absolute",
    right: "12px",
    top: "12px",
    display:"flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",    
  }
  const closeButton={
    display: "flex",
    justifyContent: "center",
    alignItems: "center",    
    border:"none" ,
    background:"none"    
  };
  const icon={
    pointerEvents:"none"    
  };
  
  const cardStyle = (isActive) => ({
    width: isActive ? "220px" : "180px",
    height: isActive ? "280px" : "260px",
    margin: isActive ?"0 -20px":"0",
    padding:"6px",
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

  const imageStyle = {
    width: "100%",   
    borderRadius: "12px",    
    objectFit: "cover",
  };
  const borschName={
    fontSize:"14px",
    fontWeight:"500"
  };
  const flex={
    display: "flex",
    justifyContent:"space-between",
    margin:"10px 0",
    color:"#878787"
  }

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
        { arrayBorsch.map((borsch, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={index}
              style={cardStyle(isActive)}
              onClick={() => setActiveIndex(index)}
            >
              <img src={borsch.photo_urls[0]} alt={`img-${index}`} style={imageStyle} />
              <div style={box}>
                <button type="button" onClick={onClose} style={closeButton}>                               
                  <IconDelete  style={icon} aria-label={'close'} id='close'/>
                </button>
                {/* <IconLike/> */}
                <IconLikeInl/>
              </div>
              <p style={borschName}>{borsch.name}</p>
              <div style={flex}>
                <p>{borsch.price}</p>
                <p>{borsch.weight}</p>
              </div>
              <RatingIconsSvg overall_rating={borsch.overall_rating} /> 
              <p>{place.name}</p>         
            </div>
          );
        })}
      </div>
    </div>
  );
}
