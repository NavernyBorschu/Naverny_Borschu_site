import {Link,useParams } from "react-router-dom";
import { ReactComponent as IconDelete } from './close.svg';
import { RatingIconsSvg } from "../../components/RatingIconsSvg";
import borsch from '../../data/borsch.json';
import data from '../../data/places.json';
import style from './BorschPage.module.css';
// import { Grade } from "../../components/Grade/Grage";

export const BorschPage=()=>{
    const { borschId } = useParams();
    const borschOne = borsch.find(item => String(item.id_borsch) === String(borschId));
   const place = data.find(item=>String(item.id) === String(borschOne.place_id));   
        
  return( 
    <div className={style.BorschPage}>
        <Link to="/" className={style.btnClose}>                               
            <IconDelete  aria-label={'close'} id='close'/>        
        </Link>
        <div className={style.wrap}>
            <h2 className={style.title}>{place.name}</h2>
            <div>
                <div  className={style.imageBox}>
                    <img src={`/${borschOne.photo_urls[0]}`} alt={'img_borsch'} className={style.imageStyle}/>
                </div>
                <h3 className={style.nameBorsch}>{borschOne.name}</h3>
                <p className={style.adress}>{place.adress}</p>
                <div className={style.flex}>
                    <p>{borschOne.weight}</p>
                    <p>{borschOne.price}</p>
                </div>
                <h4>Оцінки та відгуки</h4>
                <div className={style.flex}>
                    <h2 className={style.grade}>{borschOne.overall_rating}</h2>
                    <RatingIconsSvg overall_rating={borschOne.overall_rating}/>
                </div>
                {/* <Grade/> */}
                
            </div>  
        </div>                     
    </div>   
  )   
}