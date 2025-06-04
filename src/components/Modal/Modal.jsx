import { Component } from "react";
import { ReactComponent as IconDelete } from './cross-small.svg';
import styles from './Modal.module.css';


export class Modal extends Component  {
    componentDidMount() {        
        window.addEventListener('keydown', this.handleKeyClose);
    };
    componentWillUnmount() {       
        window.removeEventListener('keydown', this.handleKeyClose)
    };
    handleKeyClose = event => {   
      if (event.code === 'Escape') {
        this.props.onClose();
      }
    };
 
    handleClose = event => {
       const { onClose } = this.props;
        if (event.target === event.currentTarget) {
           onClose();
        }
    };

    render() {
        const {children,onClose} = this.props;
        return ( 
            <>
                <div className={styles.Backdrop}/>     
                <div className={styles.Overlay} onClick={this.handleClose}>
                    <div className={styles.Modal}>
                        <button type="button" onClick={onClose} className={styles.deleteButton}>                               
                            <IconDelete className={styles.icon} aria-label={'icon-cross'} id='search'/>
                        </button>
                        <div>{children}</div>
                    </div>
                </div>      
            </>                      
        )
    }    
}


