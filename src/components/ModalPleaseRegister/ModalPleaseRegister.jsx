import {useEffect, useState} from "react";
import {Modal} from "../../components/Modal";
import {Button} from "../../components/Button";
import {ReactComponent as Logo} from '../../assets/images/logo.svg';
import typography from '../../styles/typography.module.css';
import style from './ModalPleaseRegister.module.css';

export const ModalPleaseRegister = ({onClose, onRegisterPage, onGoToMap}) => {
    const [spin, setSpin] = useState(false);

    useEffect(() => {
        setSpin(true);
        const t = setTimeout(() => setSpin(false), 1000);
        return () => clearTimeout(t);
    }, []);

    return (
        <Modal onClose={onClose}>
            <div className={style.modalContent}>
                <Logo className={`${style.modalLogo} ${spin ? style["spin-once"] : ""}`}/>
                <h2 className={`${typography.modalTitle} ${style.modalTitle}`}>Без профілю? Це як борщ без сметани!</h2>
                <p className={`${typography.modalParagraph} ${style.modalParagraph}`}>
                    Наче все ок, але чогось не вистачає. Створи профіль - і буде повний смак
                </p>
                <Button type="submit"
                        name="Створити профіль"
                        onClick={() => {
                            onRegisterPage();
                            onClose();
                        }}/>
                <button
                    className={`${typography.fontBtn} ${style.modalCloseBtn}`}
                    onClick={() => {
                        onGoToMap();
                        onClose();
                    }}
                >
                    Не зараз
                </button>
            </div>
        </Modal>
    );
};
