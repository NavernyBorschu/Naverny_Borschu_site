import {useNavigate} from "react-router-dom";
import {InputField} from "../../components/InputField";
import {Button} from "../../components/Button";
import layout from "../../styles/layout.module.css";
import typography from "../../styles/typography.module.css";
import style from "./UserPasswordPage.module.css";

export const UserPasswordPage = () => {
    const navigate = useNavigate();

    const userPassword = '.......';

    const handleRedirect = () => {
        navigate('/profile/password-change');
    }

    return (
        <div className={layout.wrapper}>
            <h2 className={`${typography.mobileTitle} ${style.title}`}>Пароль</h2>
            <InputField label='Пароль' id='password' type='password' placeholder={userPassword} disabled={true}/>
            <Button type='button' name='Змінити пароль' disabled={false} onClick={handleRedirect}/>
        </div>

    )
}