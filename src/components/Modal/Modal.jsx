import { Component } from "react";
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
        const {children} = this.props;
        return ( 
            <>
                <div className={styles.Backdrop}/>     
                <div className={styles.Overlay} onClick={this.handleClose}>
                    <div className={styles.Modal}>                        
                        <div>{children}</div>
                    </div>
                </div>      
            </>                      
        )
    }    
}


