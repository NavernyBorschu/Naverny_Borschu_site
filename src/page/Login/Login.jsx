import { useNavigate } from 'react-router-dom';
import  {  GoogleLogin  }  from  '@react-oauth/google' ;
import { Logo } from '../../components/Logo';
import { MODES } from '../../components/Map/Map';
import style from "./Login.module.css";

export const Login=()=>{ 
  const navigate=useNavigate();
 
   
  return(
    <div className={style.container}>
      <Logo/>
      <div className={style.btnGoogle}>
        < GoogleLogin         
          onSuccess = { (credentialResponse)  =>  {   
          console.log('Успіх!', credentialResponse);    
          localStorage.setItem('mode', MODES.SET_MARKER);
          localStorage.setItem('auth', true);                   
          navigate('/add-borsch');
          window.location.reload();          
        } } 
        onError = { ( )  =>  { 
          console.log ( 'Вхід не вдалий' ) ; 
        } }
        auto_select        
        theme = "outline"
        shape = "circle"                   
      />
      </div>      
    </div>    
  )   
}

