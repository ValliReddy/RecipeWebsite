import React, { useState } from 'react';
import axios from 'axios';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'otp') setOtp(value);
    else if (name === 'newPassword') setNewPassword(value);
    else if (name === 'confirmNewPassword') setConfirmPassword(value);
  };
//   console.log(newPassword,confirmPassword)

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/reset-password', { email, otp, newPassword, confirmNewPassword })
      .then(res => {
        setMessage('Password reset successful. You can now log in with your new password.');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch(err => {
        console.error(err);
        setMessage('Failed to reset password. Please try again.');
      });
  };
  

  return (
    <div className="form">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          required
        />
        <label>OTP:</label>
        <input
          type="text"
          name="otp"
          value={otp}
          onChange={handleInputChange}
          required
        />
        <label>New Password:</label>
        <input
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={handleInputChange}
          required
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmNewPassword"
          value={confirmNewPassword}
          onChange={handleInputChange}
          required
        />
        <button className="button button-block" type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPasswordForm;
