import {Link} from 'react-router-dom';
import {Logo} from '../../components/Logo';
import {GoogleAuth} from "../../components/GoogleAuth";
import layout from '../../styles/layout.module.scss';
import typography from '../../styles/typography.module.css';
import style from "./Login.module.css";

export const Login = () => {

    return (
        <div className={layout.authContainer}>
            <Logo/>
            <h2 className={`${typography.mobileTitle} ${style.title}`}>Вхід</h2>
            <GoogleAuth/>
            <p className={style.link}>Не маєте акаунту? <Link to="/register" className={typography.mobileBtn}>
                Зареєструватися
            </Link>
            </p>
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

