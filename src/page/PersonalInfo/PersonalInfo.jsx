import {useState} from "react";
import {AvatarUploader} from "../../components/AvatarUploader";
import {Button} from "../../components/Button";
import {InputField} from "../../components/InputField";
import layout from '../../styles/layout.module.css';
import typography from '../../styles/typography.module.css';
import style from './PersonalInfo.module.css';

export const PersonalInfo = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');

    const isFormFilled = name || email || country;

    const handleSubmitForm = (e) => {
        e.preventDefault();
        console.log(name, email, country);
    }

    return (
        <div className={layout.wrapper}>
            <h1 className={typography.mobileTitle}>Особиста інформація</h1>
            <div className={style.infoContainer}>
                <AvatarUploader/>
                <div>
                    <h2 className={typography.mobileTitleSmall}>Ім'я</h2>
                </div>
            </div>

            <form action="">

                <InputField
                    label="Ім'я"
                    id="name"
                    type="text"
                    placeholder="Ім'я"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <InputField
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <InputField
                    label="Країна"
                    id="country"
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                />

                <Button type='submit' name='Зберегти' onClick={handleSubmitForm} disabled={!isFormFilled}/>
            </form>
        </div>
    )
}