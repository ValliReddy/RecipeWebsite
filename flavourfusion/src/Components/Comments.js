import React, { useState } from 'react';

const CommentSection = () => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    // Here you can handle submitting the comment and rating to the server
    // Reset the form fields and rating after submission
    setComment('');
    setRating(0);
  };

  return (
    <div className="comment-section">
      <form className="comment-form" onSubmit={handleSubmitComment}>
        <div className="form-group">
          <label htmlFor="comment">Comment <span className="required">*</span></label>
          <textarea 
            id="comment" 
            name="comment" 
            cols="30" 
            rows="5" 
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
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
                &#9733;
              </span>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="name">Name <span className="required">*</span></label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email <span className="required">*</span></label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
          />
        </div>
        <button type="submit" className="submit-comment">Post Comment</button>
      </form>
    </div>
  );
};



const CommentCard = ({ isOpen }) => {
  return (
    <div className={`comment-card ${isOpen ? 'open' : ''}`}>
      {isOpen && <CommentSection />}
    </div>
  );
};

export default CommentCard;
