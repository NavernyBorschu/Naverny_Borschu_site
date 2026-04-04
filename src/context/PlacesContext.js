import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { placesAPI } from '../api';
import placesData from '../data/places.json';

const PlacesContext = createContext();

export const PlacesProvider = ({ children }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const allPlacesRef = useRef([]);

  useEffect(() => {
    const savedFilteredPlaces = localStorage.getItem('filteredPlaces');
    const savedFilters = localStorage.getItem('borschFilters');

    if (savedFilteredPlaces && savedFilters) {
      try {
        const parsedFilteredPlaces = JSON.parse(savedFilteredPlaces);
        const parsedFilters = JSON.parse(savedFilters);

        if (parsedFilters.searchQuery && parsedFilters.searchQuery.trim() !== '') {
          setPlaces(parsedFilteredPlaces);
          setLoading(false);
          // Still load full data in background for search base
          loadPlacesData(true);
        } else {
          loadPlacesData();
        }
      } catch (error) {
        console.error('Ошибка восстановления:', error);
        loadPlacesData();
      }
    } else {
      loadPlacesData();
    }
  }, []);

  const loadPlacesData = async (backgroundOnly = false) => {
    try {
      const apiPlaces = await placesAPI.getAll();
      allPlacesRef.current = apiPlaces;
      if (!backgroundOnly) {
        setPlaces(apiPlaces);
      }
      localStorage.setItem('places', JSON.stringify(apiPlaces));
    } catch (error) {
      console.error('API error, falling back to local data:', error);
      // Fallback: try localStorage, then JSON
      const stored = localStorage.getItem('places');
      if (stored) {
        const parsed = JSON.parse(stored);
        allPlacesRef.current = parsed;
        if (!backgroundOnly) setPlaces(parsed);
      } else {
        allPlacesRef.current = placesData;
        if (!backgroundOnly) setPlaces(placesData);
        localStorage.setItem('places', JSON.stringify(placesData));
      }
    } finally {
      if (!backgroundOnly) setLoading(false);
    }
  };

  const getPlaceById = (id) => {
    return places.find(place => String(place.id) === String(id));
  };

  const getAllPlaces = () => {
    return places;
  };

  const getPlacesByType = (type) => {
    return places.filter(place => place.type === type);
  };

  const getPlacesByCity = (city) => {
    return places.filter(place => place.city === city);
  };

  const searchPlacesByName = useCallback((searchQuery) => {
    if (!searchQuery || searchQuery.trim() === '') {
      localStorage.removeItem('filteredPlaces');
      return places;
    }

    const query = searchQuery.toLowerCase().trim();
    const source = allPlacesRef.current.length > 0 ? allPlacesRef.current : places;
    const filteredPlaces = source.filter(place =>
      place.name && place.name.toLowerCase().includes(query)
    );

    localStorage.setItem('filteredPlaces', JSON.stringify(filteredPlaces));
    return filteredPlaces;
  }, [places]);

  const updatePlacesBySearch = useCallback((searchQuery) => {
    if (!searchQuery || searchQuery.trim() === '') {
      // Restore all places
      const all = allPlacesRef.current.length > 0 ? allPlacesRef.current : places;
      setPlaces(all);
      localStorage.setItem('places', JSON.stringify(all));
      localStorage.removeItem('filteredPlaces');
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const source = allPlacesRef.current.length > 0 ? allPlacesRef.current : places;
    const filteredPlaces = source.filter(place =>
      place.name && place.name.toLowerCase().includes(query)
    );

    setPlaces(filteredPlaces);
    localStorage.setItem('places', JSON.stringify(filteredPlaces));
    localStorage.setItem('filteredPlaces', JSON.stringify(filteredPlaces));
  }, [places]);

  const getFirstPlaceCenter = useCallback(() => {
    if (places.length > 0 && places[0].location) {
      return places[0].location;
    }
    return null;
  }, [places]);

  useEffect(() => {
    if (places.length > 0) {
      localStorage.setItem('places', JSON.stringify(places));
    }
  }, [places]);

  const addPlace = (newPlace) => {
    const placeWithId = {
      ...newPlace,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };

    const updatedPlaces = [...places, placeWithId];
    setPlaces(updatedPlaces);
    allPlacesRef.current = [...allPlacesRef.current, placeWithId];
    localStorage.setItem('places', JSON.stringify(updatedPlaces));

    return placeWithId;
  };

  const updatePlace = (id, updates) => {
    const updatedPlaces = places.map(place =>
      String(place.id) === String(id) ? { ...place, ...updates, updated_at: new Date().toISOString() } : place
    );

    setPlaces(updatedPlaces);
    localStorage.setItem('places', JSON.stringify(updatedPlaces));
  };

  const deletePlace = (id) => {
    const updatedPlaces = places.filter(place => String(place.id) !== String(id));
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
    restoreAllPlaces: () => loadPlacesData()
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
