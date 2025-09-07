import { createContext, useContext, useState, useEffect } from 'react';
import commentsData from '../data/comments.json';

const CommentsContext = createContext();

export const CommentsProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных при инициализации
  useEffect(() => {
    loadComments();
  }, []);

  // Загрузка данных из localStorage или JSON
  const loadComments = () => {
    try {
      const storedComments = localStorage.getItem('comments');
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      } else {
        // Если в localStorage нет данных, загружаем из JSON
        setComments(commentsData);
        localStorage.setItem('comments', JSON.stringify(commentsData));
      }
    } catch (error) {
      console.error('Ошибка загрузки комментариев:', error);
      setComments(commentsData);
    } finally {
      setLoading(false);
    }
  };

  // Добавление нового комментария с оценками
  const addComment = (newComment) => {
    // Проверяем, что у нас есть оценки (обязательно)
    if (!newComment.rating_salt || !newComment.rating_meat || !newComment.rating_beet || 
        !newComment.rating_density || !newComment.rating_aftertaste || !newComment.rating_serving) {
      return null;
    }
    
    // Генерируем временный user_id для нового комментария
    // В будущем здесь будет реальный ID пользователя из системы авторизации
    const tempUserId = `temp_user_${Date.now()}`;
    
    const commentWithId = {
      ...newComment,
      id: Date.now().toString(), // Временный ID комментария
      created_at: new Date().toLocaleDateString('uk-UA'),
      user_id: tempUserId, // Временный ID пользователя
    };

    const updatedComments = [...comments, commentWithId];
    
    setComments(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));

    // Автоматически обновляем общую оценку борща на основе всех комментариев
    updateBorschOverallRating(newComment.id_borsch, updatedComments);

    // TODO: При появлении API заменить на:
    // await api.comments.create(commentWithId);
    
    return commentWithId;
  };

    // Функция для автоматического обновления общей оценки борща на основе комментариев
  const updateBorschOverallRating = (borschId, commentsToUse = null) => {
    // Используем переданные комментарии или получаем из состояния
    const commentsArray = commentsToUse || comments;
    
    const borschComments = commentsArray.filter(comment => comment.id_borsch === borschId);
    
    if (borschComments.length === 0) {
      return;
    }

    // Вычисляем средние оценки по всем комментариям
    const totalRatings = borschComments.reduce((acc, comment) => {
      return {
        rating_salt: acc.rating_salt + parseFloat(comment.rating_salt || 0),
        rating_meat: acc.rating_meat + parseFloat(comment.rating_meat || 0),
        rating_beet: acc.rating_beet + parseFloat(comment.rating_beet || 0),
        rating_density: acc.rating_density + parseFloat(comment.rating_density || 0),
        rating_aftertaste: acc.rating_aftertaste + parseFloat(comment.rating_aftertaste || 0),
        rating_serving: acc.rating_serving + parseFloat(comment.rating_serving || 0),
        count: acc.count + 1
      };
    }, {
      rating_salt: 0, rating_meat: 0, rating_beet: 0, 
      rating_density: 0, rating_aftertaste: 0, rating_serving: 0, count: 0
    });

    const averageRatings = {
      rating_salt: (totalRatings.rating_salt / totalRatings.count).toFixed(1),
      rating_meat: (totalRatings.rating_meat / totalRatings.count).toFixed(1),
      rating_beet: (totalRatings.rating_beet / totalRatings.count).toFixed(1),
      rating_density: (totalRatings.rating_density / totalRatings.count).toFixed(1),
      rating_aftertaste: (totalRatings.rating_aftertaste / totalRatings.count).toFixed(1),
      rating_serving: (totalRatings.rating_serving / totalRatings.count).toFixed(1)
    };

    // Вычисляем общую оценку
    const overallRating = (
      (totalRatings.rating_salt + totalRatings.rating_meat + totalRatings.rating_beet + 
       totalRatings.rating_density + totalRatings.rating_aftertaste + totalRatings.rating_serving) / 
      (totalRatings.count * 6)
    ).toFixed(1);

    // Обновляем борщ в localStorage
    const storedBorsch = localStorage.getItem('borsch');
    
    if (storedBorsch) {
      try {
        const borschList = JSON.parse(storedBorsch);
        
        // Находим борщ для обновления
        const borschToUpdate = borschList.find(borsch => borsch.id_borsch === borschId);
        
        if (borschToUpdate) {
          const updatedBorschList = borschList.map(borsch => 
            borsch.id_borsch === borschId 
              ? { 
                  ...borsch, 
                  ...averageRatings, 
                  overall_rating: overallRating,
                  updated_at: new Date().toISOString()
                }
              : borsch
          );
          
          localStorage.setItem('borsch', JSON.stringify(updatedBorschList));

          // Уведомляем все компоненты об обновлении данных
          window.dispatchEvent(new CustomEvent('borschDataUpdated', { 
            detail: { borschId, averageRatings, overallRating } 
          }));
          
          // Принудительно обновляем BorschContext
          setTimeout(() => {
            window.dispatchEvent(new Event('borschDataUpdated'));
          }, 100);
        }
      } catch (error) {
        console.error('Ошибка при обновлении оценок борща:', error);
      }
    }
  };

  // Получение комментариев для конкретного борща
  const getCommentsByBorschId = (borschId) => {
    return comments.filter(comment => comment.id_borsch === borschId);
  };

  // Получение среднего рейтинга для борща на основе комментариев
  const getAverageRatingByBorschId = (borschId) => {
    const borschComments = getCommentsByBorschId(borschId);
    if (borschComments.length === 0) return null;

    const totalRatings = borschComments.reduce((acc, comment) => {
      return {
        rating_salt: acc.rating_salt + parseFloat(comment.rating_salt || 0),
        rating_meat: acc.rating_meat + parseFloat(comment.rating_meat || 0),
        rating_beet: acc.rating_beet + parseFloat(comment.rating_beet || 0),
        rating_density: acc.rating_density + parseFloat(comment.rating_density || 0),
        rating_aftertaste: acc.rating_aftertaste + parseFloat(comment.rating_aftertaste || 0),
        rating_serving: acc.rating_serving + parseFloat(comment.rating_serving || 0),
        overall_rating: acc.overall_rating + parseFloat(comment.overall_rating || 0),
        count: acc.count + 1
      };
    }, {
      rating_salt: 0, rating_meat: 0, rating_beet: 0, 
      rating_density: 0, rating_aftertaste: 0, rating_serving: 0, 
      overall_rating: 0, count: 0
    });

    return {
      rating_salt: (totalRatings.rating_salt / totalRatings.count).toFixed(1),
      rating_meat: (totalRatings.rating_meat / totalRatings.count).toFixed(1),
      rating_beet: (totalRatings.rating_beet / totalRatings.count).toFixed(1),
      rating_density: (totalRatings.rating_density / totalRatings.count).toFixed(1),
      rating_aftertaste: (totalRatings.rating_aftertaste / totalRatings.count).toFixed(1),
      rating_serving: (totalRatings.rating_serving / totalRatings.count).toFixed(1),
      overall_rating: (totalRatings.overall_rating / totalRatings.count).toFixed(1),
      commentCount: totalRatings.count
    };
  };

  // Обновление комментария
  const updateComment = (id, updates) => {
    const updatedComments = comments.map(comment => 
      comment.id === id ? { ...comment, ...updates, updated_at: new Date().toISOString() } : comment
    );
    
    setComments(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));

    // TODO: При появлении API заменить на:
    // await api.comments.update(id, updates);
  };

  // Удаление комментария
  const deleteComment = (id) => {
    const updatedComments = comments.filter(comment => comment.id !== id);
    setComments(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));

    // TODO: При появлении API заменить на:
    // await api.comments.delete(id);
  };

  // Синхронизация с сервером (для будущего использования)
  const syncWithServer = async () => {
    // TODO: При появлении API реализовать синхронизацию
  };

  const value = {
    comments,
    loading,
    addComment,
    updateComment,
    deleteComment,
    getCommentsByBorschId,
    getAverageRatingByBorschId,
    updateBorschOverallRating,
    syncWithServer,
    loadComments
  };

  return (
    <CommentsContext.Provider value={value}>
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error('useComments must be used within CommentsProvider');
  }
  return context;
};
