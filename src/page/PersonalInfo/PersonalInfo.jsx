import {useState} from "react";
import {AvatarUploader} from "../../components/AvatarUploader";
import {Button} from "../../components/Button";
import layout from '../../styles/layout.module.css';
import typography from '../../styles/typography.module.css';
import style from './PersonalInfo.module.css';

export const PersonalInfo = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const isFormFilled = name && email && password;

    const handleSubmitForm = (e) => {
        e.preventDefault();
        console.log(name, email, password);
    }

    return (
        <div className={layout.wrapper}>
            <h1 className={typography.mobileTitle}>Особиста інформація</h1>
            <div>
                <AvatarUploader/>
                <div>
                    <h2 className={typography.mobileTitleSmall}>Ім'я Прізвище</h2>
                </div>
            </div>

            <form action="">
                <div className={style.inputGroup}>
                    <label htmlFor='name' className={style.inputLabel}>Ім'я</label>
                    <input type='text' id='name' className={style.inputField} placeholder="Ім'я" value={name}
                           onChange={e => setName(e.target.value)}/>
                </div>
                <input type='email' placeholder='Email' value={email}
                       onChange={e => setEmail(e.target.value)}/>
                <input type='password' placeholder='Password' value={password}
                       onChange={e => setPassword(e.target.value)}/>
                <Button type='submit' name='Зберегти' onClick={handleSubmitForm} disabled={!isFormFilled}/>
            </form>
        </div>
    )
}