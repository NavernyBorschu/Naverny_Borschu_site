import {useState} from 'react';
import {Link} from 'react-router-dom';
import {ButtonProfile} from '../../components/ButtonProfile';
import {ModalLogout} from "../../components/ModalLogout";
import Logo from '../../assets/images/logo.svg';
import advertIcon from '../../assets/images/profile-advert-img.png';
import personalInfoIcon from '../../assets/images/profile-personal-icon.png';
import addedBorshchIcon from '../../assets/images/profile-added-borshch-icon.png';
import passwordIcon from '../../assets/images/profile-password-icon.png';
import logoutIcon from '../../assets/images/profile-logout-icon.png';
import aboutIcon from '../../assets/images/profile-info-icon.png';
import helpIcon from '../../assets/images/profile-help-icon.png';
import policyIcon from '../../assets/images/profile-policy-icon.png';
import arrowIcon from '../../assets/images/profile-arrow-icon.png';
import layout from '../../styles/layout.module.css';
import typography from '../../styles/typography.module.css';
import style from './Profile.module.css';
import {ModalPleaseRegister} from "../../components/ModalPleaseRegister/ModalPleaseRegister";

export const Profile = () => {
    const [activeButton, setActiveButton] = useState('profile'); // 'settings'
    const [showModal, setShowModal] = useState(false);
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);

    const user = JSON.parse(localStorage.getItem('userProfile'));

    if (!user) {
        return (
            <ModalPleaseRegister
                onClose={() => setShowRegistrationModal(false)}
                onRegisterPage={() => {
                    window.location.href = '/register';
                }}
                onGoToMap={() => {
                    window.location.href = '/';
                }}
            />
        );
    }

    const linksForProfileBtn = [
        {path: '/profile/personal-information', label: 'Особиста інформація', icon: personalInfoIcon},
        {path: '/profile/added-borsches', label: 'Додані борщі', icon: addedBorshchIcon},
        {path: '/profile/change-password', label: 'Пароль', icon: passwordIcon},
        {label: 'Вийти з акаунту', icon: logoutIcon, type: 'button'},
    ];

    const linksForSettingsBtn = [
        {path: '/about', label: 'Про додаток', icon: aboutIcon},
        {path: '/help', label: 'Help', icon: helpIcon},
        {path: '/profile/policy', label: 'Політика конфіденційності', icon: policyIcon},
    ]

    const activeLinks = activeButton === 'profile' ? linksForProfileBtn : linksForSettingsBtn;

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleLogout = () => {
        localStorage.removeItem("userProfile");
        localStorage.removeItem("auth");
        localStorage.removeItem("mode");

        setShowModal(false);
        window.location.href = "/";
    };


    return (
        <div className={layout.wrapper}>
            <h1 className={typography.mobileTitle}>Мій профіль</h1>
            <div className={style.userHeader}>
                <img src={Logo} alt='User avatar'/>
                <div>
                    <h2 className={typography.mobileTitleSmall}>{user.given_name}</h2>
                </div>
            </div>

            <div className={style.advertBanner}>
                <div className={style.advertText}>
                    <h4 className={`${typography.mobileTitleSmall} ${style.advertHeader}`}>Наверни Борщу - і друзів
                        запроси!</h4>
                    <p className={typography.mobileFootnote}>Поділись додатком зі своїми. Разом смачніше!</p>
                </div>
                <img src={advertIcon} alt="Invite your friends"/>
            </div>


            <div className={style.userButtons}>
                <ButtonProfile
                    name='Профіль'
                    active={activeButton === 'profile'}
                    onClick={() => setActiveButton('profile')}
                />
                <ButtonProfile
                    name='Налаштування'
                    active={activeButton === 'settings'}
                    onClick={() => setActiveButton('settings')}
                />
            </div>

            <div className={style.linksContainer}>
                {activeLinks.map(({path, label, icon, type}) =>
                    type === 'button' ? (
                        <button key={label} onClick={handleOpenModal} className={style.linkWrap}>
                            <div className={style.linkGroup}>
                                <img src={logoutIcon} alt="Logout"/>
                                <span className={typography.mobileBody}>Вийти з акаунту</span>
                            </div>
                        </button>
                    ) : (
                        <Link key={path} to={path} className={style.linkWrap}>
                            <div className={style.linkGroup}>
                                <img src={icon} alt={label}/>
                                <span className={typography.mobileBody}>{label}</span>
                            </div>
                            <img src={arrowIcon} alt="Arrow" className={style.arrow}/>
                        </Link>
                    )
                )}
            </div>

            {showModal && <ModalLogout
                onClose={handleCloseModal}
                onLogout={handleLogout}
            />}
        </div>
    );
}