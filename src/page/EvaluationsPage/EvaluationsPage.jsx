import { useState,useCallback } from "react";
import { useParams,Link } from "react-router-dom";
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
import borsch from '../../data/borsch.json';
import data from '../../data/places.json';
import style from './EvaluationsPage.module.css';

// додати запит на сервер
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

export const EvaluationsPage = () => {
    const [isActive,setIsActive] =useState(false);
    const [isSent,setIsSent] =useState(false);
    const { borschId } = useParams();
    
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
   const borschOne = borsch.find(item => String(item.id_borsch) === String(borschId));
   const place = data.find(item=>String(item.id) === String(borschOne.place_id));
  const isFormValid =
    Object.values(grades).every((val) => val !== null) && comment.trim() !== "";

  const handleGradeChange = (key, value) => {
    setGrades((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    setIsSent((prev) => !prev);
    if (!isFormValid) return;
    const data = { ...grades, comment };
    
    // todo відправка на сервер
    console.log("Відправлено:", data);    
  };

    const onCloseForm = useCallback(() => {
        setIsActive((prev) => !prev);
    }, []);

  return (
    <div className={style.wrapp} key={"evaluations_page"}>
      <FotoBorschGallary images={borschOne.photo_urls} height={"215px"}/>
      <Link className={style.back} to={`/borsch/${borschId}`}><IconBack/></Link>
      <div className={style.contentImg}>
        <div>
          <p>{borschOne.name}</p>
          <p className={style.text}>{place.name}</p>
        </div>
        <div>
          <p>{borschOne.price}</p>
          <p className={style.text}>{borschOne.weight}</p>          
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
