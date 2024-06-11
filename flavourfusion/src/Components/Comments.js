import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { store } from '../App';


const CommentSection = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const [token] = useContext(store); 
  const [commentId,setCommentId]=useState('');

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      let storedToken = token || localStorage.getItem('token'); // Retrieve token from context or local storage
      if (!storedToken) {
        navigate('/login'); // If token is not available, redirect to login page
        return;
      }

      // Send comment data to the server with authentication and postId
      const response = await axios.post('http://localhost:5000/comments', {
        content: comment,
        rating: rating,
     
      }, {
        headers: {
          'x-token': storedToken // Include token in request headers
        }
      });

      const { commentId } = response.data; // Extract the commentId from the response
      setCommentId(commentId);
      console.log(commentId)
      // Reset form after successful submission
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
    </div>
  );
};





const CommentCard = ({ isOpen,commentId}) => {
  return (
    <div className={`comment-card ${isOpen ? 'open' : ''}`}>
      {isOpen && <CommentSection />}
    
    </div>
  );
};



export default CommentCard;
