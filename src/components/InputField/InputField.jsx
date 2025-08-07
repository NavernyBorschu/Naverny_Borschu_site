import style from './InputField.module.css'; // adjust path
import typography from '../../styles/typography.module.css'; // adjust path

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
            <input
                type={type}
                id={id}
                className={style.inputField}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        </div>
    );
};

