import {useEffect, useState} from "react";
import {Modal} from "../../components/Modal";
import {Button} from "../../components/Button";
import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import typography from '../../styles/typography.module.css';
import style from './ModalLogout.module.css';

export const ModalLogout = ({onClose, onLogout}) => {
    const [spin, setSpin] = useState(false);

    useEffect(() => {
        setSpin(true);
        const t = setTimeout(() => setSpin(false), 1000);
        return () => clearTimeout(t);
    }, []);

    return (
        <Modal onClose={onClose}>
            <div className={style.modalContent}>
                <Logo className={`${style.modalLogo} ${spin ? style["spin-once"] : ""}`} />
                <h2 className={`${typography.modalTitle} ${style.modalTitle}`}>Вийти з акаунту</h2>
                <p className={`${typography.modalParagraph} ${style.modalParagraph}`}>
                    Все збережено! Повертайся Навертати Борщі разом з нами
                </p>
                <Button type="submit" name="Вийти" onClick={onLogout}/>
                <button
                    className={`${typography.fontBtn} ${style.modalCloseBtn}`}
                    onClick={onClose}
                >
                    Продовжити Навертати Борщі
                </button>
            </div>
        </Modal>
    );
};
