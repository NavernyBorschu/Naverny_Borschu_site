import { createContext, useContext, useState, useEffect } from 'react';
import { borschAPI } from '../api';
import borschData from '../data/borsch.json';

const BorschContext = createContext();

export const BorschProvider = ({ children }) => {
  const [borsch, setBorsch] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBorschData();

    const handleBorschDataUpdated = () => {
      loadBorschData();
    };

    window.addEventListener('borschDataUpdated', handleBorschDataUpdated);

    return () => {
      window.removeEventListener('borschDataUpdated', handleBorschDataUpdated);
    };
  }, []);

  const loadBorschData = async () => {
    try {
      const apiBorsch = await borschAPI.getAll();
      setBorsch(apiBorsch);
      localStorage.setItem('borsch', JSON.stringify(apiBorsch));
    } catch (error) {
      console.error('API error, falling back to local data:', error);
      // Fallback: try localStorage, then JSON
      const stored = localStorage.getItem('borsch');
      if (stored) {
        setBorsch(JSON.parse(stored));
      } else {
        setBorsch(borschData);
        localStorage.setItem('borsch', JSON.stringify(borschData));
      }
    } finally {
      setLoading(false);
    }
  };

  const getBorschById = (id) => {
    return borsch.find(b => String(b.id_borsch) === String(id));
  };

  const getAllBorsch = () => {
    return borsch;
  };

  const getBorschByPlaceId = (placeId) => {
    return borsch.filter(b => String(b.place_id) === String(placeId));
  };

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

  const updateBorsch = (id, updates) => {
    const updatedBorsch = borsch.map(b =>
      String(b.id_borsch) === String(id) ? { ...b, ...updates, updated_at: new Date().toISOString() } : b
    );

    setBorsch(updatedBorsch);
    localStorage.setItem('borsch', JSON.stringify(updatedBorsch));
  };

  const deleteBorsch = (id) => {
    const updatedBorsch = borsch.filter(b => String(b.id_borsch) !== String(id));
    setBorsch(updatedBorsch);
    localStorage.setItem('borsch', JSON.stringify(updatedBorsch));
  };

  const updateBorschRating = (id, ratingUpdates) => {
    const updatedBorsch = borsch.map(b =>
      String(b.id_borsch) === String(id) ? { ...b, ...ratingUpdates, updated_at: new Date().toISOString() } : b
    );

    setBorsch(updatedBorsch);
    localStorage.setItem('borsch', JSON.stringify(updatedBorsch));
  };

  const syncWithLocalStorage = () => {
    loadBorschData();
  };

  const getAveragePlaceRating = (placeId) => {
    const placeBorsch = borsch.filter(b => String(b.place_id) === String(placeId));
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
