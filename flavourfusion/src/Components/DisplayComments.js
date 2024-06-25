import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { RecipeContext } from '../App';
import ReplyForm from './ReplyForm';

const CommentDisplay = ({ recipeID }) => {
  const [comments, setComments] = useState([]);
  const [replyingCommentId, setReplyingCommentId] = useState(null);
  const [repliesVisible, setRepliesVisible] = useState({});

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/comments/${recipeID}`);
        setComments(response.data);
        // Initialize replies visibility state for each comment
        const initialRepliesVisibleState = {};
        response.data.forEach(comment => {
          initialRepliesVisibleState[comment._id] = false;
        });
        setRepliesVisible(initialRepliesVisibleState);
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

  const handleReplyClick = (commentId) => {
    // Toggle replies visibility for the clicked comment
    setRepliesVisible(prevState => ({
      ...prevState,
      [commentId]: !prevState[commentId]
    }));

    // Set replyingCommentId to the clicked comment to show reply form
    setReplyingCommentId(commentId);
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
          
          <strong><a onClick={() => handleReplyClick(comment._id)}>Reply</a></strong>
          {replyingCommentId === comment._id && (
            <ReplyForm commentId={comment._id} recipeID={recipeID} setReplyingCommentId={setReplyingCommentId} />
          )}
          {/* Display replies only if repliesVisible[comment._id] is true */}
          {repliesVisible[comment._id] && (
            <div className="replies">
              {comment.replies.map((reply) => (
                <div key={reply._id} className="reply">
                  <p>
                    <strong>{reply.user.username}</strong> replied:
                  </p>
                  <p>{reply.content}</p>
                  <p>{new Date(reply.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentDisplay;
