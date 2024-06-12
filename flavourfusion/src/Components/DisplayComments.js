import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentDisplay = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [commentIds, setCommentIds] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/comments/${postId}`);
        const fetchedComments = response.data;

        // Filter out comments that are already present
        const newComments = fetchedComments.filter(comment => !commentIds.includes(comment._id));

        // Update commentIds and setComments
        const updatedCommentIds = [...commentIds, ...newComments.map(comment => comment._id)];
        setCommentIds(updatedCommentIds);
        setComments(prevComments => [...prevComments, ...newComments]);

        // Update localStorage with only unique comments
        localStorage.setItem('comments', JSON.stringify(comments.concat(newComments)));
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [postId]); // Fetch comments only when postId changes

  useEffect(() => {
    const storedComments = localStorage.getItem('comments');
    if (storedComments) {
      const parsedComments = JSON.parse(storedComments);
      const uniqueCommentIds = [...new Set(parsedComments.map(comment => comment._id))];

      setCommentIds(uniqueCommentIds);
      setComments(parsedComments);
    }
  }, []); // Load comments only on component mount

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
