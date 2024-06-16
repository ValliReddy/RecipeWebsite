import React, { useState, useEffect,useContext} from 'react';
import axios from 'axios';
import { RecipeContext } from '../App';

const CommentDisplay = ({}) => {
  const { recipeID } = useContext(RecipeContext);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/comments/${recipeID}`);
        const fetchedComments = response.data;
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [recipeID]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<span key={`star-${i}`} className="star">&#9733;</span>);
    }
    return (
      <div className="stars">
        {stars}
      </div>
    );
  };

  return (
    <div className="comment-list">
      {comments.map(comment => (
        <div key={comment._id} className="comment" style={{ backgroundColor: '#f3f3f3', padding: '10px', marginBottom: '10px' }}>
          <p><strong>{comment.user.username}</strong></p>
          <p style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{comment.content}</span>
            {renderStars(comment.rating)}
          </p>
          <p>{new Date(comment.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentDisplay;
