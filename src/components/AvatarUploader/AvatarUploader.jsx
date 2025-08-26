import userPhotoUploadIcon from "../../assets/images/profile-user-photo-upload.png";
import style from './AvatarUploader.module.css';
import {useRef, useState} from "react";

export const AvatarUploader = () => {
    const [avatar, setAvatar] = useState(userPhotoUploadIcon);
    const inputRef = useRef(null);

    const handleClick = () => {
        inputRef.current.click();
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAvatar(event.target.result);
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