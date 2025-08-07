import layout from "../../styles/layout.module.css";
import typography from "../../styles/typography.module.css";
import style from "../UserPasswordPage/UserPasswordPage.module.css";
import {InputField} from "../../components/InputField";
import {Button} from "../../components/Button";
import {useState} from "react";

export const PasswordChangePage = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const isDisabled = !(currentPassword && newPassword && confirmPassword && newPassword === confirmPassword);

    const handleClick = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            console.warn('All fields are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            console.warn('Passwords do not match.');
            return;
        }

        console.log('Button pressed. Send to server:', {
            currentPassword,
            newPassword,
            confirmPassword
        });

        // API call
    };


    return (
        <div className={layout.wrapper}>
            <h2 className={`${typography.mobileTitle} ${style.title}`}>Зміна пароль</h2>

            <InputField
                label='Поточний пароль' id='currentPassword' type='password' placeholder='Поточний пароль'
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
            />
            <InputField
                label='Новий пароль' id='newPassword' type='password' placeholder='Новий пароль'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
            <InputField
                label='Підтвердити пароль' id='confirmPassword' type='password' placeholder='Підтвердити пароль'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />

            <Button type='button' name='Змінити пароль' disabled={isDisabled} onClick={handleClick}/>
        </div>

    )
}