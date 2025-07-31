import userPhotoUploadIcon from "../../assets/images/profile-user-photo-upload.png";
import style from './AvatarUploader.module.css';

export const AvatarUploader = () => {

    return (
        <img src={userPhotoUploadIcon} alt='Your avatar' className={style.userAvatar}/>
    )
}