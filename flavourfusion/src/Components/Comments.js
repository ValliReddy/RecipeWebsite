import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { store } from '../App';
import CommentDisplay from './DisplayComments';


const CommentSection = ({recipeID}) => {
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
      let storedToken = token || localStorage.getItem('token'); 
      if (!storedToken) {
        navigate('/login'); 
        return;
      }

    
      const response = await axios.post('http://localhost:5000/comments', {
        content: comment,
        rating: rating,
        recipe:recipeID
     
      }, {
        headers: {
          'x-token': storedToken 
        }
      });
      console.log(response.data)
      const { commentId } = response.data; 
      setCommentId(commentId);
      console.log(commentId)
  
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
        <CommentDisplay postId={commentId} recipeID={recipeID} />
      </form>
    </div>
  );
};


// const CommentCard = ({ isOpen, commentId }) => {
//   return (
//     <div className={`comment-card ${isOpen ? 'open' : ''}`}>
//       {isOpen && <CommentSection />}
//       <CommentDisplay postId={commentId} />
//     </div>
//   );
// };

export default CommentSection;



