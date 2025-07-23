// import { googleLogout } from '@react-oauth/google';
import { useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
  import { useLocation } from "react-router-dom";
import { getBrowserLocation } from '../../utils/geo';
// import { Autocomplete } from '../../components/Autocomplete';
import {Link} from "react-router-dom";
import { Map } from '../../components/Map';
import { MODES } from '../../components/Map/Map';
import data from '../../data/data.json';
import style from './MapPage.module.css';


const API_KEY=process.env.REACT_APP_API_KEY_MAP;
const libraries=['places'];
const defaultCenter = {
  lat: 50.450001,
  lng: 30.523333
}


export const MapPage = ( )=> {  
  const [center,setCenter] = useState(defaultCenter);  
  const [markers,setMarkers] = useState(data);  
  const location = useLocation();
  let currentPath = location.pathname;
  console.log(currentPath);
  console.log(currentPath = '/');
  
  const mode = Number(localStorage.getItem('mode')) || MODES.MOVE; 
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries
  })

  const onMarkerAdd=useCallback((coordinates)=>{            
    setMarkers([...markers,
      {location:coordinates,
      id:`${coordinates.lat}`,
      url:'fotoborsh.jpg'
    }]);      
  },[markers])  

  useEffect(()=>{
    getBrowserLocation().then((curLoc)=>{
      setCenter(curLoc)
    })
    .catch((defaultCenter)=>{
      setCenter(defaultCenter)
    })
  },[])
  
  // const handleLogout=()=>{    
  //   googleLogout();
  //   localStorage.clear();
  //   navigate('/');  
  // }
  
 // const onPlaceSelect=useCallback((coordinates)=>{
  //   setCenter(coordinates);
  // },[])

  // const toggleMode=useCallback(()=>{
  //   switch(mode){
  //     case MODES.MOVE:
  //       setMode(MODES.SET_MARKER);       
  //       break;
  //     case MODES.SET_MARKER:
  //       setMode(MODES.MOVE);        
  //       break;
  //       default:
  //         setMode(MODES.MOVE);          
  //   }   
  // },[mode])

  return (        
    <div className={style.pageHome}>      
       {/* {mode===MODES.SET_MARKER && <div className={style.btnLogoutWrap}>                   
          <button onClick={handleLogout} className={style.btnLogout}>Logout</button>
        </div>} */}
      {/* <Autocomplete isLoaded={isLoaded} onSelect={onPlaceSelect}/> */}
      {mode===MODES.MOVE && <div className={style.btnWrap}>             
        <Link to="/list"  className={style.btn}>Список</Link>               
      </div> }      
      {isLoaded 
      ?<Map 
          center={center} 
          mode={mode} 
          markers={markers} 
          onMarkerAdd={onMarkerAdd}          
        /> 
      : <>Loading</> } 
    </div>
  );
}

