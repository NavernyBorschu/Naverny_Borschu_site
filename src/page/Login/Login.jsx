import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Logo} from '../../components/Logo';
import {GoogleAuth} from "../../components/GoogleAuth";
import {ModalRegistrationSuccess} from "../../components/ModalRegistrationSuccess";
import layout from '../../styles/layout.module.scss';
import typography from '../../styles/typography.module.css';
import style from "./Login.module.css";

export const Login = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    return (
        <div className={layout.authContainer}>
            <Logo/>
            <h2 className={`${typography.mobileTitle} ${style.title}`}>Вхід</h2>
            <GoogleAuth onSuccess={() => setShowModal(true)}/>
            <p className={style.link}>Не маєте акаунту? <Link to="/register" className={typography.mobileBtn}>
                Зареєструватися
            </Link>
            </p>
            {showModal && <ModalRegistrationSuccess
                onClose={() => setShowModal(false)}
                onGoToMap={() => navigate('/')}
                onContinue={() => navigate(-1)}
            />}
        </div>
    );
}


// {/*<div className={style.btnGoogle}>*/
// }
// {/*  < GoogleLogin         */
// }
// {/*    onSuccess = { (credentialResponse)  =>  {   */
// }
// {/*    console.log('Успіх!', credentialResponse);    */
// }
// {/*    localStorage.setItem('mode', MODES.SET_MARKER);*/
// }
// {/*    localStorage.setItem('auth', true);                   */
// }
// {/*    navigate('/add-borsch');*/
// }
// {/*    window.location.reload();          */
// }
// {/*  } } */
// }
// {/*  onError = { ( )  =>  { */
// }
// {/*    console.log ( 'Вхід не вдалий' ) ; */
// }
// {/*  } }*/
// }
// {/*  auto_select        */
// }
// {/*  theme = "outline"*/
// }
// {/*  shape = "circle"                   */
// }
// {/*/>*/
// }
// {/*</div>      */
// }
// {/*   // </div>*/
// }
// {/* // )*/
// }
// {/*//}*/
// }

