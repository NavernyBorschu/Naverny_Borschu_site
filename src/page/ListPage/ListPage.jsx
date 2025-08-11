import {Link, useNavigate} from "react-router-dom";
import { Filters } from '../../components/Filters/Filters';
import { RatingIconsSvg } from "../../components/RatingIconsSvg";
import { ButtonVertion } from "../../components/ButtonVersion";
import { ReactComponent as IconLike } from './like.svg';
import { ReactComponent as IconLink } from './link.svg';
import { ReactComponent as IconDitail } from './ditail.svg';
import { FotoBorschGallary } from "../../components/FotoBorschGallary";
import borsch from '../../data/borsch.json';
import data from '../../data/places.json';
import style from './ListPage.module.css';
// запит насервер додати
export const ListPage=()=>{
  const navigate = useNavigate();
  const onClickCard = (borschId) => {
    navigate(`/borsch/${borschId}`);
  };
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
                  <FotoBorschGallary images={el.photo_urls} height={"120px"}/>                  
                  <div className={style.box}>                
                    <ButtonVertion
                        type="button"
                        onClick={console.log("передає лінк")}
                        icon={IconLink}
                    />
                    <ButtonVertion
                        type="button"
                        onClick={console.log("Тут буде функція яка змінює ключ лайку")}
                        icon={IconLike}
                    />
                  </div>                  
                  <div className={style.flex}>
                    <p className={style.borschName}>{el.name}</p>
                    <p className={style.borschPrice}>{el.price}</p>                    
                  </div>
                  <RatingIconsSvg overall_rating={el.overall_rating} /> 
                  <div className={style.flex}>
                    <p>{nameBorsch(el.place_id)}</p>
                    <ButtonVertion
                      type="button"
                      onClick={() => onClickCard(el.id_borsch)}
                      icon={IconDitail}
                    />
                  </div>
                  
                </div>
              )                    
            })} 
        </div>
         
      </div>
    )   
  }