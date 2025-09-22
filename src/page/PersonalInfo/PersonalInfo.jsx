import {useEffect, useState} from "react";
import {AvatarUploader} from "../../components/AvatarUploader";
import {Button} from "../../components/Button";
import {InputField} from "../../components/InputField";
import Logo from '../../assets/images/logo.svg';
import layout from '../../styles/layout.module.scss';
import typography from '../../styles/typography.module.css';
import style from './PersonalInfo.module.css';

export const PersonalInfo = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');

    // ✅ Load user from localStorage on mount
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("userProfile"));
        if (storedUser) {
            setName(storedUser.given_name || storedUser.name || '');
            setEmail(storedUser.email || '');
            setCountry(storedUser.locale || '');
        }
    }, []);

    const isFormFilled = name || email || country;

    const handleSubmitForm = (e) => {
        e.preventDefault();

        console.log(name, email, country);

        const updatedUser = {
            given_name: name,
            email,
            country,
            picture: JSON.parse(localStorage.getItem("userProfile"))?.picture || ''
        };

        // ✅ Save back to localStorage
        localStorage.setItem("userProfile", JSON.stringify(updatedUser));

        console.log("Updated user:", updatedUser);
        alert("Зміни збережені ✅");
    }

    return (
        <div className={layout.wrapper}>
            <h1 className={typography.mobileTitle}>Особиста інформація</h1>
            <div className={style.infoContainer}>

                <AvatarUploader initialAvatar={Logo} />

                <div>
                    <h2 className={typography.mobileTitleSmall}>{name || "Ім'я"}</h2>
                </div>
            </div>

            <form onSubmit={handleSubmitForm}>
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
                    required
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

                <Button type='submit' name='Зберегти' disabled={!isFormFilled}/>
            </form>
        </div>
    )
}