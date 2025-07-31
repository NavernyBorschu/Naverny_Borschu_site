import  { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ReactComponent as IconDelete } from './close.svg';
// import { ReactComponent as IconLike } from './like.svg';
import { ReactComponent as IconLikeInl } from './like_inl.svg';
import { RatingIconsSvg } from "../RatingIconsSvg";
import borsch from '../../data/borsch.json';


export const Gallery=({onClose,id_place,place})=> {
  const [activeIndex, setActiveIndex] = useState(0);
  const arrayBorsch = borsch.filter(i => i.place_id === id_place); 
  const navigate = useNavigate();

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
    height: isActive ? "280px" : "220px",
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
  const imageBox={
    height: "128px"    
  }
  const imageStyle = {
    width: "100%", 
    height:"100%",  
    borderRadius: "12px",    
    objectFit: "cover",
  };
  const borschName={
    fontSize:"14px",
    fontWeight:"500",
    marginTop:"6px"
  };
  const flex={
    display: "flex",
    justifyContent:"space-between",
    margin:"10px 0",
    color:"#878787"
  }
  const onClickCard=(borschId)=>{      
    navigate(`/borsch/${borschId}`);
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
              <div style={box}>
                <button type="button" onClick={onClose} style={closeButton}>                               
                  <IconDelete  style={icon} aria-label={'close'} id='close'/>
                </button>
                {/* <IconLike/> */}
                <IconLikeInl/>
              </div>
              <div style={imageBox}>
                <img src={borsch.photo_urls[0]} alt={`img-${index}`} style={imageStyle} />
              </div>              
              <p style={borschName}>{borsch.name}</p>
              <div style={flex}>
                <p>{borsch.price}</p>
                <p>{borsch.weight}</p>
              </div>
              <RatingIconsSvg overall_rating={borsch.overall_rating} />
              <div style={flex}>
                <p>{place.name}</p> 
                <button type="button" onClick={()=>onClickCard(borsch.id_borsch)} style={closeButton}>...</button>    
              </div>                  
            </div>
          );
        })}
      </div>
    </div>
  );
}
