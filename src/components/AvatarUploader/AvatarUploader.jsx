import userPhotoUploadIcon from "../../assets/images/profile-user-photo-upload.png";
import style from './AvatarUploader.module.css';
import {useEffect, useRef, useState} from "react";

export const AvatarUploader = ({initialAvatar}) => {
    const [avatar, setAvatar] = useState(initialAvatar || userPhotoUploadIcon);
    const inputRef = useRef(null);

    // ✅ Sync if parent updates the avatar
    useEffect(() => {
        if (initialAvatar) {
            setAvatar(initialAvatar);
        }
    }, [initialAvatar]);

    const handleClick = () => {
        inputRef.current.click();
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target.result);

                // ✅ Save uploaded avatar to localStorage userProfile
                const storedUser = JSON.parse(localStorage.getItem("userProfile")) || {};
                localStorage.setItem(
                    "userProfile",
                    JSON.stringify({...storedUser, picture: event.target.result})
                );

            }
            reader.readAsDataURL(file);
        }
    }

    return (

        <div
            className={`${style.avatarWrapper} ${avatar ? style.round : ""}`}
            onClick={handleClick}
        >
            <img
                src={avatar || userPhotoUploadIcon}
                alt="Your avatar"
                className={style.userAvatar}
            />
            <input
                type="file"
                ref={inputRef}
                style={{display: "none"}}
                accept="image/*"
                onChange={handleFileChange}
            />
        </div>
    )
}