import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Загрузка данных пользователя при инициализации
  useEffect(() => {
    loadUserData();
  }, []);

  // Загрузка данных пользователя из localStorage
  const loadUserData = () => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedAuth = localStorage.getItem('auth');
      
      if (storedUser && storedAuth === 'true') {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
    } finally {
      setLoading(false);
    }
  };

  // Вход пользователя
  const login = (userData) => {
    const userWithTimestamp = {
      ...userData,
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    setUser(userWithTimestamp);
    setIsAuthenticated(true);
    
    localStorage.setItem('user', JSON.stringify(userWithTimestamp));
    localStorage.setItem('auth', 'true');

    // TODO: При появлении API заменить на:
    // await api.auth.login(userData);
  };

  // Выход пользователя
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('user');
    localStorage.removeItem('auth');

    // TODO: При появлении API заменить на:
    // await api.auth.logout();
  };

  // Обновление данных пользователя
  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates, updated_at: new Date().toISOString() };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // TODO: При появлении API заменить на:
    // await api.user.update(updates);
  };

  // Обновление времени последней активности
  const updateLastActivity = () => {
    if (user) {
      const updatedUser = { ...user, lastActivity: new Date().toISOString() };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Проверка авторизации
  const checkAuth = () => {
    const auth = localStorage.getItem('auth');
    const userData = localStorage.getItem('user');
    
    if (auth === 'true' && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        return true;
      } catch (error) {
        console.error('Ошибка парсинга данных пользователя:', error);
        logout();
        return false;
      }
    }
    return false;
  };

  // Получение избранных борщей
  const getFavoriteBorsch = () => {
    try {
      const favorites = localStorage.getItem('favoriteBorsch');
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Ошибка загрузки избранных борщей:', error);
      return [];
    }
  };

  // Добавление борща в избранное
  const addToFavorites = (borschId) => {
    try {
      const favorites = getFavoriteBorsch();
      if (!favorites.includes(borschId)) {
        const updatedFavorites = [...favorites, borschId];
        localStorage.setItem('favoriteBorsch', JSON.stringify(updatedFavorites));
      }
    } catch (error) {
      console.error('Ошибка добавления в избранное:', error);
    }
  };

  // Удаление борща из избранного
  const removeFromFavorites = (borschId) => {
    try {
      const favorites = getFavoriteBorsch();
      const updatedFavorites = favorites.filter(id => id !== borschId);
      localStorage.setItem('favoriteBorsch', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Ошибка удаления из избранного:', error);
    }
  };

  // Проверка, находится ли борщ в избранном
  const isFavorite = (borschId) => {
    const favorites = getFavoriteBorsch();
    return favorites.includes(borschId);
  };

  // Синхронизация с сервером (для будущего использования)
  const syncWithServer = async () => {
    // TODO: При появлении API реализовать синхронизацию
    console.log('Синхронизация с сервером пока не реализована');
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
    updateLastActivity,
    checkAuth,
    getFavoriteBorsch,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    syncWithServer
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};





