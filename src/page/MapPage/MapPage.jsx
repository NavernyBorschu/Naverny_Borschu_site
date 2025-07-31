import { useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useEffect, useState } from 'react';
import { getBrowserLocation } from '../../utils/geo';
import {Link} from "react-router-dom";
import { Autocomplete } from '../../components/Autocomplete';
import { Map } from '../../components/Map';
import { Filters } from '../../components/Filters/Filters';
import { MODES } from '../../components/Map/Map';
import data from '../../data/places.json';
import borsch from '../../data/borsch.json';
import style from './MapPage.module.css';



const API_KEY=process.env.REACT_APP_API_KEY_MAP;
const libraries=['places'];
const defaultCenter = {
  lat: 50.450001,
  lng: 30.523333
}


export const MapPage = ( )=> {  
  const [center,setCenter] = useState(defaultCenter);  
  const [places,setPlaces] = useState(data);   
  
  const mode = Number(localStorage.getItem('mode')) || MODES.MOVE; 
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries
  })

  const onMarkerAdd=useCallback((coordinates)=>{            
    setPlaces([...places,
      {id:`${coordinates.lat}`,
        adress:"",        
        country:"", 
        city:"",
        name_shopping_mall:"",
        location:coordinates,      
        places:[  
           {place_id:`${coordinates.lat}+1`,
            name:"Кафе",
            type:"ресторан"},           
        ],
        grade:"9.0"
    }]);      
  },[places])  

  useEffect(()=>{
    getBrowserLocation().then((curLoc)=>{
      setCenter(curLoc)
    })
    .catch((defaultCenter)=>{
      setCenter(defaultCenter)
    })
  },[])   
  
 const onPlaceSelect=useCallback((coordinates)=>{
    setCenter(coordinates);
  },[])

  // const handleLogout=()=>{    
  //   googleLogout();
  //   localStorage.clear();
    // navigate('/');  
  // }

  return (        
    <div className={style.pageHome}>      
       {/* {mode===MODES.SET_MARKER && <div className={style.btnLogoutWrap}>                   
          <button onClick={handleLogout} className={style.btnLogout}>Logout</button>
        </div>} */}
      {mode===MODES.SET_MARKER && <Autocomplete isLoaded={isLoaded} onSelect={onPlaceSelect}/>}
      {mode===MODES.MOVE &&   
      <> 
        <Filters/>  
        <div className={style.btnWrap}> 
          <Link to="/"  className={style.btn}>Мапа</Link>          
          <Link to="/list"  className={style.btn_inl}>Список</Link>               
        </div>
        <div className={style.borsch}>(зареєстровано {borsch.length} борщів)</div>
      </>
     } 
          
      {isLoaded 
      ?<Map 
          center={center} 
          mode={mode} 
          places={places} 
          onMarkerAdd={onMarkerAdd}          
        /> 
      : <>Loading</> } 
    </div>
  );
}

