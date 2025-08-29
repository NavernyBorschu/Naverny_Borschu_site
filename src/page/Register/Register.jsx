import {useState} from "react";
import {Link} from 'react-router-dom';
import {Logo} from '../../components/Logo';
import {GoogleAuth} from "../../components/GoogleAuth";
import layout from '../../styles/layout.module.css';
import typography from '../../styles/typography.module.css';
import style from "./Register.module.css";

export const Register = () => {

    const [accepted, setAccepted] = useState(false);

    const handleCheckboxChange = () => {
        setAccepted(!accepted);
    };

    return (
        <div className={layout.authContainer}>
            <Logo/>
            <h2 className={`${typography.mobileTitle} ${style.title}`}>Реєстрація</h2>
            <GoogleAuth/>
            <p className={style.linkRedirect}>Вже маєте акаунт? <Link to="/login" className={typography.mobileBtn}>
                Вхід
            </Link>
            </p>


            <label className={style.checkboxWrapper}>
                <input
                    type="checkbox"
                    checked={accepted}
                    onChange={handleCheckboxChange}
                    className={style.hiddenCheckbox}
                />
                <span className={style.customCheckbox}>
                    {accepted && <div className={style.checkboxSign}></div>}
                </span>
                <span>
          Я погоджуюся з{" "}
                    <Link to="/terms" className={style.link}>
            Умовами користування
          </Link>{" "}
                    та{" "}
                    <Link to="/privacy" className={style.link}>
            Політикою конфіденційності
          </Link>
        </span>
            </label>
        </div>
    );
}