import { useJsApiLoader } from '@react-google-maps/api';
import React, { useCallback,  useState } from 'react';
import {Link} from "react-router-dom";
import { Autocomplete } from '../../components/Autocomplete';
import { Map } from '../../components/Map';
import { Filters } from '../../components/Filters/Filters';
import { GeoButton } from "../../components/GeoButton";
import { MODES } from '../../components/Map/Map';
import { usePlaces } from '../../context/PlacesContext';
import { useBorsch } from '../../context/BorschContext';
import { useFilters } from '../../context/FiltersContext';
import { useMediaQuery } from "../../hook/useMediaQuery";
import style from './MapPage.module.scss';

const API_KEY=process.env.REACT_APP_API_KEY_MAP;
const libraries=['places'];
const defaultCenter = {
  lat: 50.450001,
  lng: 30.523333
}
export const MapPage = ( )=> { 
  const isDesktop = useMediaQuery("(min-width: 1280px)"); 
  const [center, setCenter] = useState(() => {
    const savedLocation = localStorage.getItem('user_location');
    return savedLocation ? JSON.parse(savedLocation) : defaultCenter;
  });    
  const [originalCenter, setOriginalCenter] = useState(() => {
    const savedLocation = localStorage.getItem('user_location');
    return savedLocation ? JSON.parse(savedLocation) : defaultCenter;
  });  
  const { places, loading: placesLoading, addPlace, updatePlacesBySearch, getFirstPlaceCenter, restoreAllPlaces } = usePlaces();
  const { borsch, loading: borschLoading } = useBorsch();
  const { filters, setRestorePlaces, clearSearchQuery } = useFilters();

  
  React.useEffect(() => {
    const handleStorageChange = () => {
      const savedLocation = localStorage.getItem('user_location');
      if (savedLocation) {
        const newLocation = JSON.parse(savedLocation);
        setOriginalCenter(newLocation);
        
        if (!filters.searchQuery || filters.searchQuery.trim() === '') {
          setCenter(newLocation);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [filters.searchQuery]);
  

  const placesToShow = places;
  
  
  React.useEffect(() => {
    
    const savedFilteredPlaces = localStorage.getItem('filteredPlaces');
    const savedFilters = localStorage.getItem('borschFilters');
    
   
    if (savedFilteredPlaces && savedFilters && (!filters.searchQuery || filters.searchQuery.trim() === '') && places.length === 0) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        if (parsedFilters.searchQuery && parsedFilters.searchQuery.trim() !== '') {
          return;
        }
      } catch (error) {
        console.error('❌ Ошибка проверки восстановления:', error);
      }
    }
    
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      updatePlacesBySearch(filters.searchQuery);
    } else {
      updatePlacesBySearch('');
    }
  }, [filters.searchQuery, updatePlacesBySearch, places.length]);


  React.useEffect(() => {
    setRestorePlaces(restoreAllPlaces);
  }, [setRestorePlaces, restoreAllPlaces]);

  
  React.useEffect(() => {    
    if (placesLoading) {
      return;
    }  
    
    if (filters.searchQuery && filters.searchQuery.trim() !== '' && places.length > 0) {
      const firstPlaceCenter = getFirstPlaceCenter();
      if (firstPlaceCenter) {
        
        setCenter(firstPlaceCenter);
      }
    } else if (!filters.searchQuery || filters.searchQuery.trim() === '') {
     
      setCenter(originalCenter);
    }
  }, [places, filters.searchQuery, placesLoading, getFirstPlaceCenter, originalCenter]);
  
  const mode = Number(localStorage.getItem('mode')) || MODES.MOVE; 
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries
  })

  const onMarkerAdd=useCallback((coordinates)=>{            
    const newPlace = {
      id: `${coordinates.lat}`,
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
    };
    
    addPlace(newPlace);
  },[addPlace]) 
  
 const onPlaceSelect=useCallback((coordinates)=>{
    setCenter(coordinates);
    setOriginalCenter(coordinates); 
  },[])
 

  return (        
    <div className={style.pageHome}>      
      {!isDesktop && mode===MODES.SET_MARKER && 
      < div className={style.boxGeo}>
        <Autocomplete isLoaded={isLoaded} onSelect={onPlaceSelect}/>
        <GeoButton />
      </div>      
      }
      {isDesktop && mode===MODES.SET_MARKER &&
      <div div className={style.boxGeoDesctop}>
        <Autocomplete isLoaded={isLoaded} onSelect={onPlaceSelect}/>
      </div>      
      }
      {mode===MODES.MOVE &&   
      <> 
        <Filters/>  
        <div className={style.btnWrap}> 
          <Link to="/"  className={style.btn}>Мапа</Link>          
          <Link to="/list"  className={style.btn_inl}>Список</Link>               
        </div>
        <div className={style.borsch}>
          {borschLoading || placesLoading ? 'Завантаження...' : (
            <span className={style.borschCount}>
              (зареєстровано {borsch?.length || 0} борщів)
            </span>
          )}
        </div>
      </>
      }           
      {isLoaded && !placesLoading ? (
        <>          
          {filters.searchQuery && filters.searchQuery.trim() !== '' && places.length === 0 && (
            <div className={style.noResultsMessage}>
              <button 
                className={style.closeButton}
                onClick={() => clearSearchQuery()}
                aria-label="Закрити повідомлення"
              >
                ×
              </button>
              За вашим запитом жодного закладу не знайдено
            </div>
          )}
          <Map 
            center={center} 
            mode={mode} 
            places={placesToShow} 
            onMarkerAdd={onMarkerAdd}          
          />
        </>
      ) : (
        <div className={style.loadingContainer}>
          {!isLoaded ? 'Завантаження карти...' : 'Завантаження закладів...'}
        </div>
      )} 
    </div>
  );
}

