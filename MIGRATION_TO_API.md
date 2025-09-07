# Миграция на API

Этот документ описывает процесс перехода от localStorage к реальному API серверу.

## 🚀 Текущее состояние

Приложение использует Context API с localStorage для управления данными:
- `UserContext` - управление пользователями
- `PlacesContext` - управление заведениями  
- `BorschContext` - управление борщами
- `FiltersContext` - управление фильтрами

## 🔄 Шаги миграции

### 1. Подготовка API сервера

Убедитесь, что ваш API сервер поддерживает следующие эндпоинты:

#### Заведения (Places)
```
GET    /api/places          - получить все заведения
GET    /api/places/:id      - получить заведение по ID
POST   /api/places          - создать новое заведение
PUT    /api/places/:id      - обновить заведение
DELETE /api/places/:id      - удалить заведение
```

#### Борщи (Borsch)
```
GET    /api/borsch          - получить все борщи
GET    /api/borsch/:id      - получить борщ по ID
POST   /api/borsch          - создать новый борщ
PUT    /api/borsch/:id      - обновить борщ
DELETE /api/borsch/:id      - удалить борщ
GET    /api/borsch/place/:placeId - получить борщи по ID заведения
```

#### Пользователи (Users)
```
POST   /api/auth/login      - вход пользователя
POST   /api/auth/register   - регистрация пользователя
POST   /api/auth/logout     - выход пользователя
PUT    /api/users/profile   - обновить профиль
PUT    /api/users/password  - изменить пароль
```

#### Оценки (Ratings)
```
POST   /api/ratings         - создать оценку
PUT    /api/ratings/:id     - обновить оценку
GET    /api/ratings/borsch/:borschId - получить оценки по ID борща
```

### 2. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_API_KEY_MAP=your_google_maps_api_key
```

### 3. Обновление API файла

Замените заглушки в `src/api/index.js` на реальные API вызовы:

```javascript
// Пример для placesAPI.create
create: async (placeData) => {
  const response = await fetch(`${API_BASE_URL}/places`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(placeData)
  });
  return handleResponse(response);
},
```

### 4. Обновление контекстов

В каждом контексте замените комментарии TODO на реальные API вызовы:

```javascript
// В PlacesContext.js
const addPlace = async (newPlace) => {
  try {
    const createdPlace = await api.places.create(newPlace);
    const updatedPlaces = [...places, createdPlace];
    setPlaces(updatedPlaces);
    localStorage.setItem('places', JSON.stringify(updatedPlaces));
    return createdPlace;
  } catch (error) {
    console.error('Ошибка создания заведения:', error);
    throw error;
  }
};
```

### 5. Обработка ошибок

Добавьте обработку ошибок API:

```javascript
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);

const addPlace = async (newPlace) => {
  setLoading(true);
  setError(null);
  
  try {
    const createdPlace = await api.places.create(newPlace);
    // ... обновление состояния
  } catch (error) {
    setError(error.message);
    console.error('Ошибка API:', error);
  } finally {
    setLoading(false);
  }
};
```

### 6. Синхронизация данных

Реализуйте функцию синхронизации для загрузки данных с сервера:

```javascript
const syncWithServer = async () => {
  try {
    const serverPlaces = await api.places.getAll();
    setPlaces(serverPlaces);
    localStorage.setItem('places', JSON.stringify(serverPlaces));
  } catch (error) {
    console.error('Ошибка синхронизации:', error);
  }
};
```

### 7. Авторизация и токены

Добавьте поддержку JWT токенов:

```javascript
// В getHeaders()
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// В UserContext
const login = async (credentials) => {
  const response = await api.user.login(credentials);
  localStorage.setItem('token', response.token);
  // ... остальная логика
};
```

## 📱 Тестирование

### 1. Локальное тестирование
```bash
# Запуск приложения
npm start

# Проверка в браузере
http://localhost:3000
```

### 2. Проверка API вызовов
Откройте DevTools → Network для мониторинга API запросов.

### 3. Проверка localStorage
Откройте DevTools → Application → Local Storage для проверки сохраненных данных.

## 🚨 Возможные проблемы

### 1. CORS ошибки
Убедитесь, что сервер настроен для работы с вашим доменом.

### 2. Ошибки авторизации
Проверьте правильность токенов и их срок действия.

### 3. Проблемы с загрузкой данных
Добавьте fallback на localStorage при ошибках API.

## 🔧 Полезные команды

```bash
# Очистка localStorage (для тестирования)
localStorage.clear()

# Проверка данных в консоли
console.log('Places:', JSON.parse(localStorage.getItem('places')))
console.log('Borsch:', JSON.parse(localStorage.getItem('borsch')))
```

## 📚 Дополнительные ресурсы

- [React Context API документация](https://react.dev/reference/react/createContext)
- [Fetch API документация](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [JWT токены](https://jwt.io/)

## ✅ Чек-лист миграции

- [ ] API сервер настроен и работает
- [ ] Переменные окружения настроены
- [ ] API файл обновлен
- [ ] Контексты обновлены
- [ ] Обработка ошибок добавлена
- [ ] Авторизация настроена
- [ ] Тестирование пройдено
- [ ] Документация обновлена

После выполнения всех пунктов ваше приложение будет готово к работе с реальным API сервером!





