import { createContext, useContext, useState, useEffect } from 'react';

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    selectedTypes: [],
    selectedMeat: '',
    minPrice: 50,
    maxPrice: 5000,
    searchQuery: ''
  });

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [restorePlacesCallback, setRestorePlacesCallback] = useState(null);

  // Загрузка сохраненных фильтров из localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem('borschFilters');
    
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        
        // Если есть поисковый запрос, активируем поиск
        if (parsedFilters.searchQuery && parsedFilters.searchQuery.trim() !== '') {
          setFilters(parsedFilters);
          setIsSearchActive(true);
        } else {
          setFilters(parsedFilters);
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки фильтров:', error);
      }
    }
  }, []);

  // Сохранение фильтров в localStorage при изменении
  useEffect(() => {
    // Проверяем, не восстанавливаем ли мы состояние
    const savedFilters = localStorage.getItem('borschFilters');
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        // Если восстанавливаем поиск, не перезаписываем его
        if (parsedFilters.searchQuery && parsedFilters.searchQuery.trim() !== '' && 
            (!filters.searchQuery || filters.searchQuery.trim() === '')) {
          return;
        }
      } catch (error) {
        console.error('❌ Ошибка проверки восстановления:', error);
      }
    }
    
    localStorage.setItem('borschFilters', JSON.stringify(filters));
  }, [filters]);

  // Обновление фильтров
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Сброс фильтров
  const resetFilters = () => {
    const defaultFilters = {
      selectedTypes: [],
      selectedMeat: '',
      minPrice: 50,
      maxPrice: 5000,
      searchQuery: ''
    };
    setFilters(defaultFilters);
  };

  // Обновление типа заведения
  const togglePlaceType = (type) => {
    setFilters(prev => ({
      ...prev,
      selectedTypes: prev.selectedTypes.includes(type)
        ? prev.selectedTypes.filter(t => t !== type)
        : [...prev.selectedTypes, type]
    }));
  };

  // Обновление типа мяса
  const updateMeatType = (meat) => {
    setFilters(prev => ({
      ...prev,
      selectedMeat: meat
    }));
  };

  // Обновление ценового диапазона
  const updatePriceRange = (min, max) => {
    setFilters(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max
    }));
  };

  // Обновление поискового запроса
  const updateSearchQuery = (query) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: query
    }));
  };

  // Очистка поискового запроса
  const clearSearchQuery = () => {
    setFilters(prev => ({
      ...prev,
      searchQuery: ''
    }));
    setIsSearchActive(false);
    // При очистке поиска удаляем сохраненные отфильтрованные места
    localStorage.removeItem('filteredPlaces');
    // Сбрасываем флаг восстановления
    localStorage.removeItem('searchRestored');
    // Восстанавливаем полный список мест
    if (restorePlacesCallback) {
      restorePlacesCallback();
    }
    localStorage.removeItem('borschFilters');
  };

  // Сброс всех фильтров
  const resetAllFilters = () => {
    const defaultFilters = {
      selectedTypes: [],
      selectedMeat: '',
      minPrice: 50,
      maxPrice: 5000,
      searchQuery: ''
    };
    setFilters(defaultFilters);
    setIsSearchActive(false);
    // При сбросе фильтров удаляем сохраненные отфильтрованные места
    localStorage.removeItem('filteredPlaces');
    // Сбрасываем флаг восстановления
    localStorage.removeItem('searchRestored');
    // Восстанавливаем полный список мест
    if (restorePlacesCallback) {
      restorePlacesCallback();
    }
  };

  // Активация поиска
  const activateSearch = () => {
    setIsSearchActive(true);
  };

  // Деактивация поиска
  const deactivateSearch = () => {
    setIsSearchActive(false);
  };

  // Установка callback для восстановления мест
  const setRestorePlaces = (callback) => {
    setRestorePlacesCallback(() => callback);
  };

  // Проверка активности фильтров
  const hasActiveFilters = () => {
    return filters.selectedTypes.length > 0 || 
           filters.selectedMeat !== '' || 
           filters.minPrice !== 50 || 
           filters.maxPrice !== 5000 ||
           filters.searchQuery !== '';
  };

  // Получение активных фильтров для отображения
  const getActiveFiltersSummary = () => {
    const summary = [];
    
    if (filters.selectedTypes.length > 0) {
      summary.push(`Тип: ${filters.selectedTypes.join(', ')}`);
    }
    
    if (filters.selectedMeat !== '') {
      summary.push(`М'ясо: ${filters.selectedMeat}`);
    }
    
    if (filters.minPrice !== 50 || filters.maxPrice !== 5000) {
      summary.push(`Ціна: ${filters.minPrice} - ${filters.maxPrice} ₴`);
    }

    return summary;
  };

  const value = {
    filters,
    isSearchActive,
    updateFilters,
    resetFilters,
    resetAllFilters,
    togglePlaceType,
    updateMeatType,
    updatePriceRange,
    updateSearchQuery,
    clearSearchQuery,
    activateSearch,
    deactivateSearch,
    hasActiveFilters,
    getActiveFiltersSummary,
    setRestorePlaces
  };

  return (
    <FiltersContext.Provider value={value}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('useFilters must be used within FiltersProvider');
  }
  return context;
};

