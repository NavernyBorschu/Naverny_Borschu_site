import { useState } from "react";
import {Link,useParams } from "react-router-dom";
import { ReactComponent as IconDelete } from './close.svg';
import { ReactComponent as IconMeat } from './meat.svg';
import { ReactComponent as IconBeetroot } from './beetroot.svg';
import { ReactComponent as IconDensity } from './vegetable.svg';
import { ReactComponent as IconSalt } from './salt.svg';
import { ReactComponent as IconAftertaste } from './aftertaste.svg';
import { ReactComponent as IconServing } from './serving.svg';
import { ReactComponent as IconArrowLeft } from './arrow_left.svg';
import { ReactComponent as IconArrowRight } from './arrow_right.svg';
import { ReactComponent as IconLike } from './like.svg';
import { ReactComponent as IconLink } from './link.svg';
import { ButtonVertion } from "../../components/ButtonVersion";
import { RatingIconsSvg } from "../../components/RatingIconsSvg";
import { ProgressLine } from "../../components/ProgressLine/ProgressLine";
import { FotoBorschGallary } from "../../components/FotoBorschGallary";
import borsch from '../../data/borsch.json';
import data from '../../data/places.json';
import comments from '../../data/comments.json';
import users from '../../data/users.json';
import style from './BorschPage.module.css';
import typography from '../../styles/typography.module.css';

// додати запит на сервер

export const BorschPage=()=>{
    const { borschId } = useParams();
    const [currentPage, setCurrentPage] = useState(0);
    const commentsPerPage = 2;
    const borschOne = borsch.find(item => String(item.id_borsch) === String(borschId));
    const place = data.find(item=>String(item.id) === String(borschOne.place_id)); 
    const borschComents =   comments.filter(item => String(item.id_borsch) === String(borschId));
  
    const mergeCommentsWithUsers=(comments, users) =>{
        return comments.map(comment => {
            const user = users.find(u => u.user_id === comment.user_id);
            return {
            name: user ? `${user.name} ${user.surname}` : "Невідомо",
            photo: user?.photo_url || "",
            overall_rating: comment.overall_rating,
            created_at: comment.created_at,
            messege: comment.messege
            };
        });
    }        
    const result = mergeCommentsWithUsers(borschComents, users);


    const paginatedComments = result.slice(
    currentPage * commentsPerPage,
    currentPage * commentsPerPage + commentsPerPage
    );

    const totalPages = Math.ceil(result.length / commentsPerPage);

    const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
    };

    const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
    };   
    
  return( 
    <div className={style.BorschPage}>
        <Link to="/" className={style.btnClose}>                               
            <IconDelete  aria-label={'close'} id='close'/>        
        </Link>
        <div className={style.wrap}>
            <h2 className={style.title}>{place.name}</h2>
            <div className={style.card}>
                <div className={style.box}>
                    <ButtonVertion
                        type="button"
                        onClick={console.log("передає лінк")}
                        icon={IconLink}
                    />
                    <ButtonVertion
                        type="button"
                        onClick={console.log("Тут буду функція яка змінює ключ лайку")}
                        icon={IconLike}
                    />
                </div>
                
                {borschOne && <FotoBorschGallary images={borschOne.photo_urls} height={"215px"}/>}                
                <h3 className={style.nameBorsch}>{borschOne.name}</h3>
                <p className={style.adress}>{place.adress}</p>
                <div className={style.flex}>
                    <p>{borschOne.weight}</p>
                    <p>{borschOne.price}</p>
                </div>
                <h4>Оцінки та відгуки</h4>
                <div className={style.flex}>
                    <h2 className={style.grade}>{borschOne.overall_rating}</h2>
                    <RatingIconsSvg overall_rating={borschOne.overall_rating} size={18}/>
                    <p className={typography.mobileCaption}>{borschComents.length} Reviews</p>
                </div>
                <div className={style.gradesFlex}>
                    <ProgressLine title={'Мʼясовитість'} value={borschOne.rating_meat} icon={IconMeat}/>
                    <ProgressLine title={'Буряковість'} value={borschOne.rating_beet} icon={IconBeetroot}/>
                    <ProgressLine title={'Густина'} value={borschOne.rating_density} icon={IconDensity}/>
                    <ProgressLine title={'Солоність'} value={borschOne.rating_salt} icon={IconSalt}/>
                    <ProgressLine title={'Післясмак'} value={borschOne.rating_aftertaste} icon={IconAftertaste}/>
                    <ProgressLine title={'Подача'} value={borschOne.rating_serving} icon={IconServing}/>
                </div> 
                <div className={style.boxBtn}>
                    <Link to={`/borsch/${borschId}/evaluations`} className={style.btn}>Оцінити</Link>
                </div>
                <div className={style.comentsBox}>
                   { paginatedComments.map((item, index) => (
                        <div key={index}>
                            <div className={style.avatarBox}>
                                <div className={style.photoBox}>
                                    <img
                                    src={`/${item.photo}`}
                                    alt={`${item.name}`}
                                    className={style.photoStyle}
                                    />
                                </div>
                                <div className={style.textWrapp}>
                                    <div className={style.textBox}>
                                        <h3>{item.name}</h3>
                                        <p className={style.textDate}>{item.created_at}</p>
                                    </div>
                                    <RatingIconsSvg overall_rating={item.overall_rating} size={15}/>
                                </div>
                            </div>
                            <p>{item.messege}</p>
                        </div>
                    ))} 
                    {totalPages > 1 && (
                        <div className={style.paginationControls}>
                            <button onClick={handlePrev} disabled={currentPage === 0} >
                                <IconArrowLeft/>
                            </button>                            
                            <button onClick={handleNext} disabled={currentPage === totalPages - 1}>
                                <IconArrowRight/>
                            </button>
                        </div>
                    )}                 
                </div>                          
            </div>  
        </div>                     
    </div>   
  )   
}