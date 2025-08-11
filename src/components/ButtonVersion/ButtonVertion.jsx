import style from './ButtonVertion.module.css';


export const ButtonVertion =({
                    icon:Icon,
                    onClick,                    
                    type = 'button',
                })=>{
const classes = `${style.btn}`;
    return (
        <button
            type={type}
            onClick={onClick}
            className={classes}            
        >
          <Icon />
        </button>
    );
                
}



