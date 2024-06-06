import React, { useState } from 'react';


const CommentSection = () => {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState(''); // State for the user's name
  const [comment, setComment] = useState(''); // State for the comment text
  const [email, setEmail] = useState(''); // State for the email

  // Handle star click to set rating
  const handleStarClick = (value) => {
    setRating(value);
  };

  // Handle form submission
  const handleSubmitComment = (e) => {
    e.preventDefault();
    // Handle form submission here, including the name, email, comment, and rating
    console.log({
      name,
      email,
      comment,
      rating
    });
    // Reset the form after submission
    setName('');
    setEmail('');
    setComment('');
    setRating(0);
  };

  return (
    <div className="comment-section">
      <form className="comment-form" onSubmit={handleSubmitComment}>
        <div className="form-group">
          <label>Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
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

const CommentCard = ({ isOpen }) => {
  return (
    <div className={`comment-card ${isOpen ? 'open' : ''}`}>
      {isOpen && <CommentSection />}
    </div>
  );
};

export default CommentCard;
