import {useGoogleLogin} from "@react-oauth/google";
import {FcGoogle} from "react-icons/fc";
import {MODES} from '../../components/Map/Map';
import style from "./GoogleAuth.module.css";

export const GoogleAuth = ({onSuccess}) => {

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log("Успіх!", tokenResponse);

            localStorage.setItem("mode", MODES.SET_MARKER);
            localStorage.setItem("auth", true);

            // fetch Google profile info
            try {
                const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const profile = await res.json();
                console.log("Google profile:", profile);

                // Save profile locally to use in app
                localStorage.setItem("userProfile", JSON.stringify(profile));

                // Notify parent (Register page → show modal)
                if (onSuccess) {
                    onSuccess(profile);
                }
            } catch (err) {
                console.error("❌ Не вдалося отримати дані профілю:", err);
            }
        },
        onError: () => console.log("❌ Вхід не вдалий"),
    });

    return (
        <button className={style.googleBtn} onClick={() => login()}>
            <FcGoogle size={24} className={style.googleIcon}/>
        </button>
    )
}