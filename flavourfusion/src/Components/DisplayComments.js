import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { RecipeContext } from '../App';

const CommentDisplay = () => {
  const { recipeID } = useContext(RecipeContext);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/comments/${recipeID}`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (recipeID) {
      fetchComments();
    }
  }, [recipeID]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<span key={`star-${i}`} className="star">&#9733;</span>);
    }
    return <div className="stars">{stars}</div>;
  };

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div
          key={comment._id}
          className="comment"
          style={{
            background: '#fffffb',
            boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          <p>
            <strong>{comment.user.username}</strong>
          </p>
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
