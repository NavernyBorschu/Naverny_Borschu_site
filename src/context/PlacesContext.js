import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import placesData from '../data/places.json';

const PlacesContext = createContext();

export const PlacesProvider = ({ children }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных при инициализации
  useEffect(() => {
    // Проверяем, есть ли сохраненные отфильтрованные места
    const savedFilteredPlaces = localStorage.getItem('filteredPlaces');
    const savedFilters = localStorage.getItem('borschFilters');
    
    if (savedFilteredPlaces && savedFilters) {
      try {
        const parsedFilteredPlaces = JSON.parse(savedFilteredPlaces);
        const parsedFilters = JSON.parse(savedFilters);
        
        // Проверяем, что есть активный поиск
        if (parsedFilters.searchQuery && parsedFilters.searchQuery.trim() !== '') {
          setPlaces(parsedFilteredPlaces);
          setLoading(false);
        } else {
          loadPlacesData();
        }
      } catch (error) {
        console.error('❌ Ошибка восстановления:', error);
        loadPlacesData();
      }
    } else {
      loadPlacesData();
    }
  }, []);

  // Загрузка данных из исходного JSON (всегда полный список)
  const loadPlacesData = () => {
    try {
      setPlaces(placesData);
      localStorage.setItem('places', JSON.stringify(placesData));
    } catch (error) {
      console.error('❌ Ошибка загрузки данных мест:', error);
      setPlaces(placesData);
    } finally {
      setLoading(false);
    }
  };

  // Получение места по ID
  const getPlaceById = (id) => {
    return places.find(place => place.id === id);
  };

  // Получение всех мест
  const getAllPlaces = () => {
    return places;
  };

  // Получение мест по типу
  const getPlacesByType = (type) => {
    return places.filter(place => place.type === type);
  };

  // Получение мест по городу
  const getPlacesByCity = (city) => {
    return places.filter(place => place.city === city);
  };

  // Поиск мест по названию (регистронезависимый)
  const searchPlacesByName = useCallback((searchQuery) => {
    if (!searchQuery || searchQuery.trim() === '') {
      // Если поиск пустой, очищаем отфильтрованных места и возвращаем все
      localStorage.removeItem('filteredPlaces');
      return places;
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    // Ищем только по полю name
    const filteredPlaces = places.filter(place => 
      place.name && place.name.toLowerCase().includes(query)
    );
    
    // Сохраняем отфильтрованные места в localStorage
    localStorage.setItem('filteredPlaces', JSON.stringify(filteredPlaces));
    
    return filteredPlaces;
  }, [places]);



  // Обновление мест по поисковому запросу
  const updatePlacesBySearch = useCallback((searchQuery) => {
    if (!searchQuery || searchQuery.trim() === '') {
      // Если поиск пустой, загружаем все места обратно
      loadPlacesData();
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    // Всегда фильтруем по исходным данным из JSON
    const filteredPlaces = placesData.filter(place => 
      place.name && place.name.toLowerCase().includes(query)
    );
    
    // Обновляем основной массив places отфильтрованными данными
    setPlaces(filteredPlaces);
    // Сохраняем в localStorage
    localStorage.setItem('places', JSON.stringify(filteredPlaces));
    localStorage.setItem('filteredPlaces', JSON.stringify(filteredPlaces));
  }, []);

  // Получение центра первого элемента отфильтрованного массива
  const getFirstPlaceCenter = useCallback(() => {
    if (places.length > 0 && places[0].location) {
      return places[0].location;
    }
    return null;
  }, [places]);

  // При изменении places (например, после фильтрации) обновляем localStorage
  useEffect(() => {
    if (places.length > 0) {
      localStorage.setItem('places', JSON.stringify(places));
    }
  }, [places]);

  // Добавление нового места
  const addPlace = (newPlace) => {
    const placeWithId = {
      ...newPlace,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };

    const updatedPlaces = [...places, placeWithId];
    setPlaces(updatedPlaces);
    localStorage.setItem('places', JSON.stringify(updatedPlaces));
    
    return placeWithId;
  };

  // Обновление места
  const updatePlace = (id, updates) => {
    const updatedPlaces = places.map(place => 
      place.id === id ? { ...place, ...updates, updated_at: new Date().toISOString() } : place
    );
    
    setPlaces(updatedPlaces);
    localStorage.setItem('places', JSON.stringify(updatedPlaces));
  };

  // Удаление места
  const deletePlace = (id) => {
    const updatedPlaces = places.filter(place => place.id !== id);
    setPlaces(updatedPlaces);
    localStorage.setItem('places', JSON.stringify(updatedPlaces));
  };

  const value = {
    places,
    loading,
    getPlaceById,
    getAllPlaces,
    getPlacesByType,
    getPlacesByCity,
    searchPlacesByName,
    updatePlacesBySearch,
    getFirstPlaceCenter,
    addPlace,
    updatePlace,
    deletePlace,
    loadPlacesData,
    restoreAllPlaces: loadPlacesData
  };

  return (
    <PlacesContext.Provider value={value}>
      {children}
    </PlacesContext.Provider>
  );
};

export const usePlaces = () => {
  const context = useContext(PlacesContext);
  if (!context) {
    throw new Error('usePlaces must be used within PlacesProvider');
  }
  return context;
};
