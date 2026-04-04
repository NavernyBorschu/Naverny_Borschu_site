import { useState, useCallback } from "react";
// import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Grade } from "../../components/Grade";
import { GradeWithIcons } from "../../components/GradeWithIcons";
import { ReactComponent as IconMeat } from './meat.svg';
import { ReactComponent as IconBeetroot } from './beetroot.svg';
import { ReactComponent as IconDensity } from './vegetable.svg';
import { ReactComponent as IconSalt } from './salt.svg';
import { ReactComponent as IconAftertaste } from './aftertaste.svg';
import { ReactComponent as IconServing } from './serving.svg';
import { ReactComponent as IconSmileLeft } from './fxemoji_angry.svg';
import { ReactComponent as IconSmileRight } from './fxemoji_smiletongue.svg';
import { ReactComponent as IconBack } from './arrow_back.svg';
import { FotoBorschGallary } from "../../components/FotoBorschGallary";
import { Button } from "../../components/Button";
import {CardSaveEvalutions} from "../../components/CardSaveEvalutions";
import {Modal} from '../../components/Modal';
import { useBorsch } from '../../context/BorschContext';
import { usePlaces } from '../../context/PlacesContext';
import { useComments } from '../../context/CommentsContext';
import style from './EvaluationsPage.module.scss';

const GradesArray = [
  {
    key: "meat",
    icon: IconMeat,
    title: "М'ясовитість",
    subtitle_left: "жодного шматочка",
    subtile_right: "у кожній ложці",
  },
  {
    key: "beetroot",
    icon: IconBeetroot,
    title: "Буряковість",
    subtitle_left: "ледь рожевий",
    subtile_right: "насичено-бордовий",
  },
  {
    key: "density",
    icon: IconDensity,
    title: "Густина",
    subtitle_left: "рідкий",
    subtile_right: "ложка стоїть",
  },
  {
    key: "salt",
    icon: IconSalt,
    title: "Солоність",
    subtitle_left: "прісний",
    subtile_right: "пересолений",
  },
  {
    key: "aftertaste",
    icon: IconAftertaste,
    title: "Післясмак",
    subtitle_left: "несмачно",
    subtile_right: "вау!",
  },
  {
    key: "serving",
    icon: IconServing,
    title: "Подача",
    subtitle_left: "неохайно",
    subtile_right: "ресторанний стиль",
  },
];

export const EvaluationsPage = ({ borschId: propId }) => {
    const [isActive, setIsActive] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const params = useParams();
    const  id = propId || params?.borschId;
    const [comment, setComment] = useState("");
    const [grades, setGrades] = useState({
      meat: null,
      beetroot: null,
      density: null,
      salt: null,
      aftertaste: null,
      serving: null,
      overall: null,
    });    
    const { getBorschById } = useBorsch();
    const { getPlaceById } = usePlaces();
    const { addComment } = useComments();    
    const borschOne = getBorschById(id);
    const place = borschOne ? getPlaceById(borschOne.place_id) : null;    
    const isFormValid = grades.meat !== null && grades.beetroot !== null && 
    grades.density !== null && grades.salt !== null && 
    grades.aftertaste !== null && grades.serving !== null && 
    grades.overall !== null;
   
    
    const handleGradeChange = (key, value) => {      
      setGrades((prev) => {
        const newGrades = { ...prev, [key]: value };        
        return newGrades;
      });
    };

      const handleSubmitForm = async (e) => {
      e.preventDefault();
      if (!isFormValid) return;

      const payload = {
        borschi: Number(id),
        rating_meat: grades.meat,
        rating_beet: grades.beetroot,
        rating_density: grades.density,
        rating_salt: grades.salt,
        rating_aftertaste: grades.aftertaste,
        rating_serving: grades.serving,
        overall_rating: grades.overall || 5,
      };

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'https://api.navernyborshchu.com/api'}/ratings/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(await res.text());
        // Also save comment locally for UI
        if (comment.trim() && borschOne) {
          addComment({ id_borsch: id, messege: comment, overall_rating: grades.overall?.toString() || '5.0' });
        }
        // Save to rated list
        const ratedIds = JSON.parse(localStorage.getItem('ratedBorsch') || '[]');
        if (!ratedIds.includes(String(id))) {
          localStorage.setItem('ratedBorsch', JSON.stringify([...ratedIds, String(id)]));
        }
        window.dispatchEvent(new Event('borschDataUpdated'));
        setIsSent(true);
      } catch (err) {
        console.error('❌ Помилка збереження оцінки:', err);
        alert('Не вдалося зберегти оцінку. Спробуйте ще раз.');
      }
    };

    const onCloseForm = useCallback(() => {
      setIsActive((prev) => !prev);
    }, []);
    
    
    if (!borschOne || !place) {
      return (
        <div className={style.wrapp}>
          <p>Завантаження даних...</p>
        </div>
      );
    }



  return (
    <div className={style.wrapp} key={"evaluations_page"}>
      <FotoBorschGallary images={borschOne.photo_urls} height={"215px"}/>
      <Link className={style.back} to={`/borsch/${id}`}><IconBack/></Link>
      <div className={style.contentImg}>
        <div className={style.nameBox1}>
          <p className={style.textName}>{borschOne.name}</p>
          <p className={style.textName}>{place.name}</p>
        </div>
        <div className={style.nameBox2}>
          <p className={style.textName}>{borschOne.price}</p>
          <p className={style.textName}>{borschOne.weight}</p>          
        </div>
      </div>
      <h3 className={style.title}>Оціни смак борщу</h3>     
      {GradesArray.map((item) => (
        <Grade
          key={item.key}
          icon={item.icon}
          title={item.title}
          labels={[item.subtitle_left, item.subtile_right]}        
          onChange={(val) => handleGradeChange(item.key, val)}
        />
      ))}     
      <GradeWithIcons
        title="Загальна оцінка"
        iconLabels={[<IconSmileLeft />, <IconSmileRight />]}        
        onChange={(val) => handleGradeChange("overall", val)}
      />     
      <div className={style.commentBlock}>
        <label htmlFor="comment" >Коментар:</label>
        <textarea
          id="comment"
          className={style.textarea}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Додайте коментар...."
        />
      </div>      
      <Button
        type="submit"
        name="Зберегти"
        onClick={onCloseForm}
        disabled={!isFormValid}
      />
     
      {isActive&&
      <Modal onClose={onCloseForm}>                    
        <CardSaveEvalutions onClose={onCloseForm} onSubmit={handleSubmitForm} disabled={!isFormValid} isSent={isSent}/>
      </Modal>}     
    </div>
  );
};
