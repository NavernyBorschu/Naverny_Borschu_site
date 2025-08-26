import {useNavigate} from "react-router-dom";
import {FotoBorschGallary} from "../../components/FotoBorschGallary";
import {ButtonVertion} from "../../components/ButtonVersion";
import {RatingIconsSvg} from "../../components/RatingIconsSvg";
import { ReactComponent as IconLikeActive } from '../../assets/icons/likeActive.svg';
import { ReactComponent as IconDitail } from '../../assets/icons/ditail.svg';
import { ReactComponent as IconLink } from '../../assets/icons/link.svg';
import data from "../../data/places.json";
import borsch from "../../data/borsch.json";
import layout from '../../styles/layout.module.css';
import typography from "../../styles/typography.module.css";
import style from "./AddedBorschesPage.module.css";

export const AddedBorschesPage = () => {
    const navigate = useNavigate();
    const onClickCard = (borschId) => {
        navigate(`/borsch/${borschId}`);
    };
    const nameBorsch=(place_id)=>{
        const place = data.find(i => String(i.id) === String(place_id));
        return place ? place.name : "Невідоме місце";
    }

    return (
        <div className={layout.wrapper}>
            <h1 className={typography.mobileTitle}>Додані борщі</h1>
            <div className={style.wrapBorsch}>
                {borsch.map((el, index) => {
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
                                    icon={IconLikeActive}
                                />
                            </div>
                            <div className={style.flex}>
                                <p className={style.borschName}>{el.name}</p>
                                <p className={style.borschPrice}>{el.price}</p>
                            </div>
                            <RatingIconsSvg overall_rating={el.overall_rating}/>
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
    );
}