import { createContext, useContext, useState, useEffect } from 'react';
import { commentsAPI } from '../api';
import commentsData from '../data/comments.json';

const CommentsContext = createContext();

export const CommentsProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const apiComments = await commentsAPI.getAll();
      setComments(apiComments);
      localStorage.setItem('comments', JSON.stringify(apiComments));
    } catch (error) {
      console.error('API error, falling back to local data:', error);
      const stored = localStorage.getItem('comments');
      if (stored) {
        setComments(JSON.parse(stored));
      } else {
        setComments(commentsData);
        localStorage.setItem('comments', JSON.stringify(commentsData));
      }
    } finally {
      setLoading(false);
    }
  };

  const addComment = (newComment) => {
    if (!newComment.rating_salt || !newComment.rating_meat || !newComment.rating_beet ||
        !newComment.rating_density || !newComment.rating_aftertaste || !newComment.rating_serving) {
      return null;
    }

    const tempUserId = `temp_user_${Date.now()}`;

    const commentWithId = {
      ...newComment,
      id: Date.now().toString(),
      created_at: new Date().toLocaleDateString('uk-UA'),
      user_id: tempUserId,
    };

    const updatedComments = [...comments, commentWithId];

    setComments(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));

    updateBorschOverallRating(newComment.id_borsch, updatedComments);

    return commentWithId;
  };

  const updateBorschOverallRating = (borschId, commentsToUse = null) => {
    const commentsArray = commentsToUse || comments;

    const borschComments = commentsArray.filter(comment => String(comment.id_borsch) === String(borschId));

    if (borschComments.length === 0) {
      return;
    }

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

    const overallRating = (
      (totalRatings.rating_salt + totalRatings.rating_meat + totalRatings.rating_beet +
       totalRatings.rating_density + totalRatings.rating_aftertaste + totalRatings.rating_serving) /
      (totalRatings.count * 6)
    ).toFixed(1);

    const storedBorsch = localStorage.getItem('borsch');

    if (storedBorsch) {
      try {
        const borschList = JSON.parse(storedBorsch);

        const borschToUpdate = borschList.find(borsch => String(borsch.id_borsch) === String(borschId));

        if (borschToUpdate) {
          const updatedBorschList = borschList.map(borsch =>
            String(borsch.id_borsch) === String(borschId)
              ? {
                  ...borsch,
                  ...averageRatings,
                  overall_rating: overallRating,
                  updated_at: new Date().toISOString()
                }
              : borsch
          );

          localStorage.setItem('borsch', JSON.stringify(updatedBorschList));

          window.dispatchEvent(new CustomEvent('borschDataUpdated', {
            detail: { borschId, averageRatings, overallRating }
          }));

          setTimeout(() => {
            window.dispatchEvent(new Event('borschDataUpdated'));
          }, 100);
        }
      } catch (error) {
        console.error('Ошибка при обновлении оценок борща:', error);
      }
    }
  };

  const getCommentsByBorschId = (borschId) => {
    return comments.filter(comment => String(comment.id_borsch) === String(borschId));
  };

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

  const updateComment = (id, updates) => {
    const updatedComments = comments.map(comment =>
      comment.id === id ? { ...comment, ...updates, updated_at: new Date().toISOString() } : comment
    );

    setComments(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));
  };

  const deleteComment = (id) => {
    const updatedComments = comments.filter(comment => comment.id !== id);
    setComments(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));
  };

  const syncWithServer = async () => {
    await loadComments();
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
