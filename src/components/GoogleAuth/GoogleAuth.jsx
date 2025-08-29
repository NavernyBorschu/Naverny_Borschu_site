import {useGoogleLogin} from "@react-oauth/google";
import {FcGoogle} from "react-icons/fc";
import {MODES} from '../../components/Map/Map';
import style from "./GoogleAuth.module.css";

export const GoogleAuth = () => {

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.log("Успіх!", tokenResponse);
            localStorage.setItem("mode", MODES.SET_MARKER);
            localStorage.setItem("auth", true);
            // navigate("/add-borsch");
            // window.location.reload();
        },
        onError: () => console.log("Вхід не вдалий"),
    });

    return (
        <button className={style.googleBtn} onClick={() => login()}>
            <FcGoogle size={24} className={style.googleIcon}/>
        </button>
    )
}