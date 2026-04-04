import {useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {ButtonProfile} from '../../components/ButtonProfile';
import {ModalPleaseRegister} from "../../components/ModalPleaseRegister/ModalPleaseRegister";
import {ReactComponent as IconBack} from '../../assets/icons/arrow_back.svg';
import {useMediaQuery} from "../../hook/useMediaQuery";
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
import layout from '../../styles/layout.module.scss';
import typography from '../../styles/typography.module.css';
import style from './Profile.module.scss';
import {ModalLogout} from "../../components/ModalLogout";
import {PersonalInfo} from "../PersonalInfo";
import {AddedBorschesPage} from "../AddedBorschesPage";
import {PasswordChangePage} from "../PasswordChangePage";


export const Profile = () => {
    const [activeButton, setActiveButton] = useState('profile'); // 'settings'
    const [showModal, setShowModal] = useState(false);
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [activeBlock, setActiveBlock] = useState('personal');
    const navigate = useNavigate();
    const isDesktop = useMediaQuery("(min-width: 1280px)");

    const personalRef = useRef(null);
    const borschesRef = useRef(null);
    const passwordRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('userProfile'));

    if (!user) {
        return (
            <ModalPleaseRegister
                onClose={() => setShowRegistrationModal(false)}
                onRegisterPage={() => navigate('/register')}
                onGoToMap={() => navigate('/')}
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
        {path: '/app-guide', label: 'Про додаток', icon: aboutIcon},
        {path: '/help', label: 'Help', icon: helpIcon},
        {path: '/faq', label: 'Політика конфіденційності', icon: policyIcon},
    ]

    const activeLinks = activeButton === 'profile' ? linksForProfileBtn : linksForSettingsBtn;
    const desktopLinks = [...linksForProfileBtn, ...linksForSettingsBtn];

    const logoutLink = desktopLinks.find(link => link.type === "button");
    const otherLinks = desktopLinks.filter(link => link.type !== "button");

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleLogout = () => {
        localStorage.removeItem("userProfile");
        localStorage.removeItem("auth");
        localStorage.removeItem("mode");

        setShowModal(false);
        navigate("/");
    };

    const scrollToBlock = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };


    return (
        <div className={layout.wrapper}>
            {isDesktop ? (
                // 🔹 Десктопна версія
                <div className={style.desktopContainer}>
                    <aside className={style.sidebar}>
                        <h1 className={typography.mobileTitle}>Мій профіль</h1>
                        <div className={style.linksContainer}>
                            {otherLinks.map(({label, icon, type}) =>
                                type === 'button' ? (
                                    <button
                                        key={label}
                                        onClick={handleOpenModal}
                                        className={style.linkWrap}
                                    >
                                        <div className={style.linkGroup}>
                                            <img src={logoutLink.icon} alt="Logout"/>
                                            <span className={typography.mobileBody}>{logoutLink.label}</span>
                                        </div>
                                    </button>
                                ) : (
                                    <button
                                        key={label}
                                        onClick={() => {
                                            if (label === 'Особиста інформація') scrollToBlock(personalRef);
                                            if (label === 'Додані борщі') scrollToBlock(borschesRef);
                                            if (label === 'Пароль') scrollToBlock(passwordRef);
                                        }}
                                        className={style.linkWrap}
                                    >
                                        <div className={style.linkGroup}>
                                            <img src={icon} alt={label}/>
                                            <span className={typography.mobileBody}>{label}</span>
                                        </div>
                                    </button>
                                )
                            )}
                        </div>


                        {/*<div className={style.linksContainer}>*/}
                        {/*    {otherLinks.map(({label, icon, type}) =>*/}
                        {/*        type === 'button' ? (*/}
                        {/*            <button*/}
                        {/*                key={label}*/}
                        {/*                onClick={handleOpenModal}*/}
                        {/*                className={style.linkWrap}*/}
                        {/*            >*/}
                        {/*                <div className={style.linkGroup}>*/}
                        {/*                    <img src={logoutLink.icon} alt="Logout"/>*/}
                        {/*                    <span className={typography.mobileBody}>{logoutLink.label}</span>*/}
                        {/*                </div>*/}
                        {/*            </button>*/}
                        {/*        ) : (*/}
                        {/*            <button*/}
                        {/*                key={label}*/}
                        {/*                onClick={() => {*/}
                        {/*                    // change the active block depending on the label*/}
                        {/*                    if (label === 'Особиста інформація') setActiveBlock('personal');*/}
                        {/*                    if (label === 'Додані борщі') setActiveBlock('borsches');*/}
                        {/*                    if (label === 'Пароль') setActiveBlock('password');*/}
                        {/*                }}*/}
                        {/*                className={`${style.linkWrap} ${activeBlock === label.toLowerCase() ? style.active : ''}`}*/}
                        {/*            >*/}
                        {/*                <div className={style.linkGroup}>*/}
                        {/*                    <img src={icon} alt={label}/>*/}
                        {/*                    <span className={typography.mobileBody}>{label}</span>*/}
                        {/*                </div>*/}
                        {/*            </button>*/}
                        {/*        )*/}
                        {/*    )}*/}
                        {/*</div>*/}

                        {/*<div className={style.linksContainer}>*/}
                        {/*    {otherLinks.map(({path, label, icon}) =>*/}
                        {/*            <Link key={path} to={path} className={style.linkWrap}>*/}
                        {/*                <div className={style.linkGroup}>*/}
                        {/*                    <img src={icon} alt={label}/>*/}
                        {/*                    <span className={typography.mobileBody}>{label}</span>*/}
                        {/*                </div>*/}
                        {/*            </Link>*/}
                        {/*    )}*/}
                        {/*    {logoutLink && (*/}
                        {/*        <button*/}
                        {/*            key={logoutLink.label}*/}
                        {/*            onClick={handleOpenModal}*/}
                        {/*            className={style.linkWrap}*/}
                        {/*        >*/}
                        {/*            <div className={style.linkGroup}>*/}
                        {/*                <img src={logoutLink.icon} alt="Logout" />*/}
                        {/*                <span className={typography.mobileBody}>{logoutLink.label}</span>*/}
                        {/*            </div>*/}
                        {/*        </button>*/}
                        {/*    )}*/}
                        {/*</div>*/}
                    </aside>

                    <section className={style.content}>
                        <div className={style.advertBanner}>
                            <div className={style.advertText}>
                                <h4 className={`${typography.mobileTitleSmall} ${style.advertHeader}`}>
                                    Наверни Борщу - і друзів запроси!
                                </h4>
                                <p className={typography.mobileFootnote}>
                                    Поділись додатком зі своїми. Разом смачніше!
                                </p>
                            </div>
                            <img src={advertIcon} alt="Invite your friends"/>
                        </div>

                        <div ref={personalRef}>
                            <PersonalInfo/>
                        </div>

                        <div ref={borschesRef}>
                            <AddedBorschesPage/>
                        </div>

                        <div ref={passwordRef}>
                            <PasswordChangePage/>
                        </div>

                        {/*{activeBlock === 'personal' && <PersonalInfo/>}*/}
                        {/*{activeBlock === 'borsches' && <AddedBorschesPage/>}*/}
                        {/*{activeBlock === 'password' && <PasswordChangePage />}*/}
                    </section>
                </div>
            ) : (
                // 🔹 Мобільна версія
                <>
                    <h1 className={typography.mobileTitle}>Мій профіль</h1>
                    <Link className={style.back} to={`/`}><IconBack/></Link>
                    <div className={style.userHeader}>
                        <img
                            src={user.picture || Logo}
                            alt='User avatar'
                            onError={(e) => { e.target.src = Logo; }}
                            style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                            <h2 className={typography.mobileTitleSmall}>{user.given_name || user.name}</h2>
                            <p style={{ fontSize: 13, color: '#888', margin: 0 }}>{user.email}</p>
                        </div>
                    </div>

                    <div className={style.advertBanner}>
                        <div className={style.advertText}>
                            <h4 className={`${typography.mobileTitleSmall} ${style.advertHeader}`}>Наверни Борщу - і
                                друзів
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
                </>)};

            {showModal && <ModalLogout
                onClose={handleCloseModal}
                onLogout={handleLogout}
            />}
        </div>
    );
}