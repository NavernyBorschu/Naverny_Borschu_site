import React, { useCallback,useState } from 'react';
import { GoogleMap} from "@react-google-maps/api";
import {defaultTheme} from './Theme';
import { CurrentLocationMarker } from '../CurrentLocationMarker/CurrentLocationMarker';
import {Modal} from '../Modal/Modal';
import {Gallery} from '../Gallery/Gallary';
import borsch from '../../data/borsch.json';
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

export const Map=({center,mode,places,onMarkerAdd})=>{ 
    const [isActiveAbout,setIsActiveAbout] =useState(false);
    const [isActiveAddForm,setIsActiveAddForm] =useState(false);
    const[newMarker,setIsNewMarker]=useState();
    const[place,setIsPlace]=useState();
    const mapRef=React.useRef(undefined);   
    const [newMarkerAddress, setNewMarkerAddress] = useState('');
    const [zoomLevel, setZoomLevel] = useState(17); 
    const [, forceUpdate] = useState(0); 
    
    const saveCornersToLocalStorage = (mapInstance) => {
    const bounds = mapInstance.getBounds();
    if (!bounds) return;

    const ne = bounds.getNorthEast(); 
    const sw = bounds.getSouthWest(); 

    const corners = {
      topLeft: { lat: ne.lat(), lng: sw.lng() },
      topRight: { lat: ne.lat(), lng: ne.lng() },
      bottomLeft: { lat: sw.lat(), lng: sw.lng() },
      bottomRight: { lat: sw.lat(), lng: ne.lng() },
    };

    localStorage.setItem('mapCorners', JSON.stringify(corners));
    
    };
    
    const onLoad = useCallback((map) => {
        mapRef.current = map;       
        setZoomLevel(map.getZoom());
        saveCornersToLocalStorage(map);
        map.addListener('bounds_changed', () => {
        saveCornersToLocalStorage(map);
    });

    map.addListener('zoom_changed', () => {
        setZoomLevel(map.getZoom());
        forceUpdate((v) => v + 1); 
    });
    }, []);
    
    const onUnmount = useCallback((map)=> {
        mapRef.current=undefined;
    }, []); 

    const onAddMarker=()=>{                  
        onMarkerAdd(newMarker);                 
        changeIsActiveAddForm();           
    };

    const changeIsActiveAddForm = useCallback(() => {
        setIsActiveAddForm((prev) => !prev);
    }, []);

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
    },[mode,changeIsActiveAddForm]);

    const onClickMarker=(id)=>{       
        const found = places.find((place) => place.id === id);
        if (found) setIsPlace(found);
        setIsActiveAbout((prev) => !prev);          
    }; 

    const getAverageOverallRating=(borsch, placeId)=> {
        const filtered = borsch.filter(item => item.place_id === placeId);

        if (filtered.length === 0) return null;

        const total = filtered.reduce((sum, item) => {
        return sum + parseFloat(item.overall_rating);
    }, 0);

  const average = total / filtered.length;

  return average.toFixed(1); 
    }
    
    return(
        <div className={style.container}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={zoomLevel}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={defoultOptions}
                onClick={onClickMap}
            >                  
            {places.map((pos) => (
                <CurrentLocationMarker
                    key={pos.id}
                    position={pos.location}
                    id={pos.id}
                    onClick={onClickMarker}
                    grade={getAverageOverallRating(borsch, pos.id)}
                    zIndexBase={zoomLevel}
                />
            ))}                     
            {isActiveAbout&&<Modal onClose={onClickMarker}>                    
                <Gallery onClose={onClickMarker} id_place={place.id} place={place}/>
            </Modal>}
            {isActiveAddForm&&<Modal onClose={changeIsActiveAddForm}>
                <button  type='button' onClick={onAddMarker}>Зберегти</button>
                <p>📍 Адрес: {newMarkerAddress}</p>
            </Modal>}                
            </GoogleMap>
           
        </div>  
    )  

}
