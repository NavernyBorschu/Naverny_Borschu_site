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
import style from './MapPage.module.scss';


// додати запит на сервер
const API_KEY=process.env.REACT_APP_API_KEY_MAP;
const libraries=['places'];
const defaultCenter = {
  lat: 50.450001,
  lng: 30.523333
}


export const MapPage = ( )=> {  
  const [center, setCenter] = useState(() => {
    const savedLocation = localStorage.getItem('user_location');
    return savedLocation ? JSON.parse(savedLocation) : defaultCenter;
  });
  
    // Сохраняем исходный центр для возврата при очистке поиска
  const [originalCenter, setOriginalCenter] = useState(() => {
    const savedLocation = localStorage.getItem('user_location');
    return savedLocation ? JSON.parse(savedLocation) : defaultCenter;
  });
  

  
  const { places, loading: placesLoading, addPlace, updatePlacesBySearch, getFirstPlaceCenter, restoreAllPlaces } = usePlaces();
  const { borsch, loading: borschLoading } = useBorsch();
  const { filters, setRestorePlaces, clearSearchQuery } = useFilters();

  // Обновляем центры при изменении геолокации в localStorage
  React.useEffect(() => {
    const handleStorageChange = () => {
      const savedLocation = localStorage.getItem('user_location');
      if (savedLocation) {
        const newLocation = JSON.parse(savedLocation);
        setOriginalCenter(newLocation);
        // Если поиск не активен, обновляем текущий центр
        if (!filters.searchQuery || filters.searchQuery.trim() === '') {
          setCenter(newLocation);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [filters.searchQuery]);
  
  // Теперь places уже содержит отфильтрованные данные при поиске
  const placesToShow = places;
  
  // При изменении поискового запроса обновляем места
  React.useEffect(() => {
    // Проверяем, есть ли сохраненные отфильтрованные места
    const savedFilteredPlaces = localStorage.getItem('filteredPlaces');
    const savedFilters = localStorage.getItem('borschFilters');
    
    // Если есть сохраненные отфильтрованные места, но поиск пустой - это восстановление
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

  // Устанавливаем callback для восстановления мест
  React.useEffect(() => {
    setRestorePlaces(restoreAllPlaces);
  }, [setRestorePlaces, restoreAllPlaces]);

  // Центрирование карты при изменении поиска или мест
  React.useEffect(() => {
    // Ждем загрузки данных
    if (placesLoading) {
      return;
    }
    
    // Если есть активный поиск и найдены места
    if (filters.searchQuery && filters.searchQuery.trim() !== '' && places.length > 0) {
      const firstPlaceCenter = getFirstPlaceCenter();
      if (firstPlaceCenter) {
        // console.log('🎯 Центрируем карту на:', firstPlaceCenter);
        setCenter(firstPlaceCenter);
      }
    } else if (!filters.searchQuery || filters.searchQuery.trim() === '') {
      // Если поиск не активен - возвращаемся к исходному центру
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
    setOriginalCenter(coordinates); // Обновляем исходный центр при выборе места
  },[])
 

  return (        
    <div className={style.pageHome}>      
      {mode===MODES.SET_MARKER && 
      < div className={style.boxGeo}>
        <Autocomplete isLoaded={isLoaded} onSelect={onPlaceSelect}/>
        <GeoButton />
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
          {/* Сообщение, если ничего не найдено */}
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

