import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/forgot-password', { email })
      .then(res => {
        setMessage('Check your email for the OTP.');
        // Optionally, handle redirection after showing the message
        setTimeout(() => {
          window.location.href = '/reset-password'; // Redirect to reset password page
        }, 3000); // Redirect after 3 seconds (adjust timing as needed)
      })
      .catch(err => {
        console.error(err);
        setMessage('Failed to initiate password reset.');
      });
  };

  return (
    <div className="form">
      <h2>Forgot Password?</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={handleInputChange}
          required
        />
        <button className="button button-block" type="submit">Send OTP</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPasswordForm;
