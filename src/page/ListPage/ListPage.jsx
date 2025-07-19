import {Link} from "react-router-dom";
import { Filters } from '../../components/Filters/Filters';
import { RatingIconsSvg } from "../../components/RatingIconsSvg";
// import { ReactComponent as IconLike } from './like.svg';
import { ReactComponent as IconLikeInl } from './like_inl.svg';
import { ReactComponent as OnMap } from './on_map.svg';
import borsch from '../../data/borsch.json';
import data from '../../data/places.json';
import style from './ListPage.module.css';

export const ListPage=()=>{
  
  const nameBorsch=(place_id)=>{  
    const place = data.find(i => String(i.id) === String(place_id));   
    return place ? place.name : "Невідоме місце";
  }

 
  
    return( 
      <div className={style.pageList}>
        <> 
          <Filters/>  
          <div className={style.btnWrap}> 
            <Link to="/"  className={style.btn_inl}>Мапа</Link>          
            <Link to="/list"  className={style.btn}>Список</Link>               
          </div>
          <div className={style.borsch}>(зареєстровано {borsch.length} борщів)</div>
        </>
        <div className={style.wrappBorsch}>
            {borsch.map((el,index)=>{                   
              return (
                <div key={index} className={style.card}>
                  <img src={el.photo_urls[0]} alt={`img-${index}`} className={style.imageStyle}/>
                  <div className={style.box}>                
                    {/* <IconLike/> */}
                    <OnMap/>
                    <IconLikeInl/>
                  </div>                  
                  <div className={style.flex}>
                    <p className={style.borschName}>{el.name}</p>
                    <p className={style.borschPrice}>{el.price}</p>
                    
                  </div>
                  <RatingIconsSvg overall_rating={el.overall_rating} /> 
                  <p>{nameBorsch(el.place_id)}</p>
                </div>
              )                    
            })} 
        </div>
         
      </div>
    )   
  }