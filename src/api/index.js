// TODO: При появлении сервера заменить заглушки на реальные API вызовы

// Базовый URL API (будет настроен при появлении сервера)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Общие заголовки для запросов
const getHeaders = () => ({
  'Content-Type': 'application/json',
  // TODO: Добавить токен авторизации
  // 'Authorization': `Bearer ${localStorage.getItem('token')}`
});

// Обработка ошибок
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// API для заведений
export const placesAPI = {
  // Получить все заведения
  getAll: async () => {
    // TODO: Заменить на реальный API
    console.log('API: Получение всех заведений');
    return [];
  },

  // Получить заведение по ID
  getById: async (id) => {
    // TODO: Заменить на реальный API
    console.log('API: Получение заведения по ID:', id);
    return null;
  },

  // Создать новое заведение
  create: async (placeData) => {
    // TODO: Заменить на реальный API
    console.log('API: Создание заведения:', placeData);
    return { ...placeData, id: Date.now().toString() };
  },

  // Обновить заведение
  update: async (id, updates) => {
    // TODO: Заменить на реальный API
    console.log('API: Обновление заведения:', id, updates);
    return { id, ...updates };
  },

  // Удалить заведение
  delete: async (id) => {
    // TODO: Заменить на реальный API
    console.log('API: Удаление заведения:', id);
    return true;
  }
};

// API для борщей
export const borschAPI = {
  // Получить все борщи
  getAll: async () => {
    // TODO: Заменить на реальный API
    console.log('API: Получение всех борщей');
    return [];
  },

  // Получить борщ по ID
  getById: async (id) => {
    // TODO: Заменить на реальный API
    console.log('API: Получение борща по ID:', id);
    return null;
  },

  // Создать новый борщ
  create: async (borschData) => {
    // TODO: Заменить на реальный API
    console.log('API: Создание борща:', borschData);
    return { ...borschData, id_borsch: Date.now().toString() };
  },

  // Обновить борщ
  update: async (id, updates) => {
    // TODO: Заменить на реальный API
    console.log('API: Обновление борща:', id, updates);
    return { id_borsch: id, ...updates };
  },

  // Удалить борщ
  delete: async (id) => {
    // TODO: Заменить на реальный API
    console.log('API: Удаление борща:', id);
    return true;
  },

  // Получить борщи по ID заведения
  getByPlaceId: async (placeId) => {
    // TODO: Заменить на реальный API
    console.log('API: Получение борщей по ID заведения:', placeId);
    return [];
  }
};

// API для пользователей
export const userAPI = {
  // Вход пользователя
  login: async (credentials) => {
    // TODO: Заменить на реальный API
    console.log('API: Вход пользователя:', credentials);
    return { 
      id: Date.now().toString(),
      email: credentials.email,
      name: credentials.name || 'Пользователь'
    };
  },

  // Регистрация пользователя
  register: async (userData) => {
    // TODO: Заменить на реальный API
    console.log('API: Регистрация пользователя:', userData);
    return { 
      id: Date.now().toString(),
      ...userData
    };
  },

  // Выход пользователя
  logout: async () => {
    // TODO: Заменить на реальный API
    console.log('API: Выход пользователя');
    return true;
  },

  // Обновить профиль пользователя
  updateProfile: async (updates) => {
    // TODO: Заменить на реальный API
    console.log('API: Обновление профиля:', updates);
    return updates;
  },

  // Изменить пароль
  changePassword: async (passwordData) => {
    // TODO: Заменить на реальный API
    console.log('API: Изменение пароля');
    return true;
  }
};

// API для оценок
export const ratingsAPI = {
  // Создать оценку
  create: async (ratingData) => {
    // TODO: Заменить на реальный API
    console.log('API: Создание оценки:', ratingData);
    return { id: Date.now().toString(), ...ratingData };
  },

  // Обновить оценку
  update: async (id, updates) => {
    // TODO: Заменить на реальный API
    console.log('API: Обновление оценки:', id, updates);
    return { id, ...updates };
  },

  // Получить оценки по ID борща
  getByBorschId: async (borschId) => {
    // TODO: Заменить на реальный API
    console.log('API: Получение оценок по ID борща:', borschId);
    return [];
  }
};

// Главный API объект
export const api = {
  places: placesAPI,
  borsch: borschAPI,
  user: userAPI,
  ratings: ratingsAPI
};

export default api;





