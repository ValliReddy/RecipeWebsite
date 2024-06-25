import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { store } from '../App';
import CommentDisplay from './DisplayComments';
import { RecipeContext } from '../App';

const CommentSection = () => {
  const { recipeID } = useContext(RecipeContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const [token] = useContext(store);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments(); // Initial fetch of comments when component mounts
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/comments/${recipeID}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      let storedToken = token || localStorage.getItem('token');
      if (!storedToken) {
        navigate('/login');
        return;
      }

      const response = await axios.post('http://localhost:5000/comments', {
        content: comment,
        rating: rating,
        recipe: recipeID,
      }, {
        headers: {
          'x-token': storedToken,
        },
      });

      // After successfully adding a comment, fetch comments again to update the list
      await fetchComments();

      setComment('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="comment-section">
      <form className="comment-form" onSubmit={handleSubmitComment}>
        <div className="form-group">
          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Rating:</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <span
                key={value}
                className={value <= rating ? 'active' : ''}
                onClick={() => handleStarClick(value)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <button type="submit" className="submit-comment">Post Comment</button>
      </form>
      <CommentDisplay
        comments={comments}
        setComments={setComments} // Pass setComments function to update comments
      />
    </div>
  );
};

export default CommentSection;
