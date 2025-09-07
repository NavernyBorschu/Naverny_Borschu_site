import { createContext, useContext, useState, useEffect } from 'react';
import borschData from '../data/borsch.json';

const BorschContext = createContext();

export const BorschProvider = ({ children }) => {
  const [borsch, setBorsch] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных при инициализации
  useEffect(() => {
    loadBorschData();
    
    // Слушаем события обновления данных от CommentsContext
    const handleBorschDataUpdated = () => {
      loadBorschData();
    };
    
    window.addEventListener('borschDataUpdated', handleBorschDataUpdated);
    
    return () => {
      window.removeEventListener('borschDataUpdated', handleBorschDataUpdated);
    };
  }, []);

  // Загрузка данных из localStorage или JSON
  const loadBorschData = () => {
    try {
      const storedBorsch = localStorage.getItem('borsch');
      if (storedBorsch) {
        setBorsch(JSON.parse(storedBorsch));
      } else {
        // Если в localStorage нет данных, загружаем из JSON
        setBorsch(borschData);
        localStorage.setItem('borsch', JSON.stringify(borschData));
      }
    } catch (error) {
      setBorsch(borschData);
    } finally {
      setLoading(false);
    }
  };

  // Получение борща по ID
  const getBorschById = (id) => {
    return borsch.find(b => b.id_borsch === id);
  };

  // Получение всех борщей
  const getAllBorsch = () => {
    return borsch;
  };

  // Получение борщей по ID места
  const getBorschByPlaceId = (placeId) => {
    return borsch.filter(b => b.place_id === placeId);
  };

  // Добавление нового борща
  const addBorsch = (newBorsch) => {
    const borschWithId = {
      ...newBorsch,
      id_borsch: Date.now().toString(),
      created_at: new Date().toISOString(),
    };

    const updatedBorsch = [...borsch, borschWithId];
    setBorsch(updatedBorsch);
    localStorage.setItem('borsch', JSON.stringify(updatedBorsch));
    
    return borschWithId;
  };

  // Обновление борща
  const updateBorsch = (id, updates) => {
    const updatedBorsch = borsch.map(b => 
      b.id_borsch === id ? { ...b, ...updates, updated_at: new Date().toISOString() } : b
    );
    
    setBorsch(updatedBorsch);
    localStorage.setItem('borsch', JSON.stringify(updatedBorsch));
  };

  // Удаление борща
  const deleteBorsch = (id) => {
    const updatedBorsch = borsch.filter(b => b.id_borsch !== id);
    setBorsch(updatedBorsch);
    localStorage.setItem('borsch', JSON.stringify(updatedBorsch));
  };

  // Обновление рейтинга борща
  const updateBorschRating = (id, ratingUpdates) => {
    const updatedBorsch = borsch.map(b => 
      b.id_borsch === id ? { ...b, ...ratingUpdates, updated_at: new Date().toISOString() } : b
    );
    
    setBorsch(updatedBorsch);
    localStorage.setItem('borsch', JSON.stringify(updatedBorsch));
  };

  // Синхронизация с localStorage (для обновления данных от CommentsContext)
  const syncWithLocalStorage = () => {
    loadBorschData();
  };

  // Получение средней оценки заведения на основе всех борщей
  const getAveragePlaceRating = (placeId) => {
    const placeBorsch = borsch.filter(b => b.place_id === placeId);
    if (placeBorsch.length === 0) return null;
    
    const total = placeBorsch.reduce((sum, b) => {
      const rating = parseFloat(b.overall_rating) || 0;
      return sum + rating;
    }, 0);
    
    return (total / placeBorsch.length).toFixed(1);
  };

  const value = {
    borsch,
    loading,
    getBorschById,
    getAllBorsch,
    getBorschByPlaceId,
    addBorsch,
    updateBorsch,
    deleteBorsch,
    updateBorschRating,
    loadBorschData,
    syncWithLocalStorage,
    getAveragePlaceRating
  };

  return (
    <BorschContext.Provider value={value}>
      {children}
    </BorschContext.Provider>
  );
};

export const useBorsch = () => {
  const context = useContext(BorschContext);
  if (!context) {
    throw new Error('useBorsch must be used within BorschProvider');
  }
  return context;
};
