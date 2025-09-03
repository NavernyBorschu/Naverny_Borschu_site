import {useEffect, useState} from "react";
import {Modal} from "../../components/Modal";
import {Button} from "../../components/Button";
import {ReactComponent as Logo} from '../../assets/images/logo.svg';
import typography from '../../styles/typography.module.css';
import style from './ModalRegistrationSuccess.module.css';

export const ModalRegistrationSuccess = ({onClose, onGoToMap, onContinue}) => {
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
                <h2 className={`${typography.modalTitle} ${style.modalTitle}`}>Реєстрація пройшла успішно!</h2>
                <p className={`${typography.modalParagraph} ${style.modalParagraph}`}>
                    Ви доєднались до спільноти пооцінювачів Борщу
                </p>
                <Button type="submit"
                        name="Перейти на мапу Борщів"
                        onClick={() => {
                            onGoToMap();
                            onClose();
                        }}/>
                <button
                    className={`${typography.fontBtn} ${style.modalCloseBtn}`}
                    onClick={() => {
                        onContinue();
                        onClose();
                    }}
                >
                    Продовжити
                </button>
            </div>
        </Modal>
    );
};
