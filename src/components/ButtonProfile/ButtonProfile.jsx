import style from './ButtonProfile.module.css';

export const ButtonProfile = ({name, onClick, active}) => {
    return (
        <button className={`${style.btn} ${active ? style.active : ''}`} onClick={onClick}>{name}</button>
    )
}