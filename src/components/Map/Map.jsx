import React, { useCallback,useState } from 'react';
import { GoogleMap} from "@react-google-maps/api";
import {defaultTheme} from './Theme';
import { CurrentLocationMarker } from '../CurrentLocationMarker/CurrentLocationMarker';
import {Marker } from "@react-google-maps/api";
import {Modal} from '../Modal/Modal';
import { CardAbout } from '../CardAbout/CardAbout';
import style from './Map.module.css';

const containerStyle = {
    width: '100%',
    height: '100%',
}
  
const defoultOptions={
    panControl:true,
    zoomControl:true,
    mapTypeControl:false,
    scaleControl:false,
    streetViewControl:false,
    rotateControl:false,
    clickableIcons:false,
    keyboardShortcuts:false,
    scrollwheel:true,
    disableDoubleClickZoom:false,
    fullscreenControl:false,
    styles:defaultTheme
}

export const MODES={
    MOVE:0,
    SET_MARKER:1
}

export const Map=({center,mode,markers,onMarkerAdd})=>{ 
    const [isActiveAbout,setIsActiveAbout] =useState(false);
    const [isActiveAddForm,setIsActiveAddForm] =useState(false);
    const[newMarker,setIsNewMarker]=useState();
    const[marker,setIsMarker]=useState();
    const mapRef=React.useRef(undefined);   
   const [newMarkerAddress, setNewMarkerAddress] = useState('');

    const onLoad = React.useCallback(function callback(map) {
        mapRef.current=map;
    }, []);
    
    const onUnmount = React.useCallback(function callback(map) {
        mapRef.current=undefined;
    }, []); 

    const onAddMarker=()=>{                  
        onMarkerAdd(newMarker);                 
        changeIsActiveAddForm();           
    };

    // const onClickMap=useCallback((loc)=>{
    //     if(mode===MODES.SET_MARKER){
    //         const lat=loc.latLng.lat();
    //         const lng=loc.latLng.lng();            
    //         setIsNewMarker({lat,lng})         
    //         changeIsActiveAddForm();                                                      
    //     }       
    // },[mode, onMarkerAdd]);
const onClickMap = useCallback((loc) => {
    if (mode === MODES.SET_MARKER) {
        const lat = loc.latLng.lat();
        const lng = loc.latLng.lng();
        const position = { lat, lng };

        setIsNewMarker(position);
        changeIsActiveAddForm();

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: position }, (results, status) => {
            if (status === 'OK' && results[0]) {
                setNewMarkerAddress(results[0].formatted_address);
            } else {
                setNewMarkerAddress('Адрес не визначено');
            }
        });
    }
}, [mode, onMarkerAdd]);

    const onClickMarker=(id)=>{       
        markers.forEach((element) => 
            {             
                if(element.id===id){                  
                    setIsMarker(element);                    
                }
            });
        isActiveAbout===true?setIsActiveAbout(false):setIsActiveAbout(true); 
          
    };  

    const changeIsActiveAddForm=()=>{
        isActiveAddForm===true?setIsActiveAddForm(false):setIsActiveAddForm(true);                
    };  
   
    
    return(
        <div className={style.container}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={defoultOptions}
                onClick={onClickMap}
            >
                  
                {markers.map((pos,index)=>{                   
                    return (
                        <div key={index}>
                           <CurrentLocationMarker position={pos.location} id={pos.id} onClick={onClickMarker}/>                            
                        </div>
                    )                    
                })}  
                <Marker position={center}/>              
                {isActiveAbout&&<Modal onClose={onClickMarker}>
                    <CardAbout marker={marker}/>
                </Modal>}
                {isActiveAddForm&&<Modal onClose={changeIsActiveAddForm}>
                    <button  type='button' onClick={onAddMarker}>Зберегти</button>
                    <p>📍 Адрес: {newMarkerAddress}</p>
                </Modal>}                
            </GoogleMap>
           
        </div>  
    )  

}
