import { Component } from "react";
import ReactDOM from 'react-dom';
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
        const {children,version} = this.props;
        return ReactDOM.createPortal( 
            <>
                <div className={styles.Backdrop}/>     
                <div className={styles.Overlay} onClick={this.handleClose}>
                    {!version && <div className={styles.Modal}>                        
                        <div>{children}</div>
                    </div>}
                    {version && <div className={styles.ModalFilters}>                        
                        <div>{children}</div>
                    </div>}
                </div>      
            </> ,document.body                         
        );
    }    
}


