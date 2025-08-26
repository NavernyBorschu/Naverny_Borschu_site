import {ReactComponent as IconPen} from '../../assets/icons/pen_grey.svg';
import style from './InputField.module.css';
import typography from '../../styles/typography.module.css';

export const InputField = ({
                               label,
                               id,
                               type = 'text',
                               placeholder,
                               value,
                               onChange,
                               disabled = false }) => {
    return (
        <div className={style.inputGroup}>
            <label htmlFor={id} className={`${typography.mobileLabel} ${style.inputLabel}`}>
                {label}
            </label>

            <div className={style.inputWrapper}>
                <input
                    type={type}
                    id={id}
                    className={`${style.inputField} ${value ? style.inputFieldActive : ''}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                />
                <IconPen className={`${style.icon} ${value ? style.iconActive : ''}`} />
            </div>
        </div>
    );
};

