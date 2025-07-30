import typography from '../../styles/typography.module.css';
import style from './Button.module.css';

export const Button = ({
                    name,
                    onClick,
                    disabled = false,
                    type = 'button',
                }) => {


    const classes = `${typography.fontBtn} ${style.btn} ${disabled ? style.disabled : style.active}`;

    return (
        <button
            type={type}
            onClick={onClick}
            className={classes}
            disabled={disabled}
        >
            {name}
        </button>
    );
};