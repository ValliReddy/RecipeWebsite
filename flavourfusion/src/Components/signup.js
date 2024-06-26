import React, { useState } from 'react';
import './SignUp.css'; // Import the CSS file
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [highlightedFields, setHighlightedFields] = useState({});
  const [passwordError, setPasswordError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
    setHighlightedFields((prevFields) => ({
      ...prevFields,
      [name]: value !== '',
    }));
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    setHighlightedFields((prevFields) => ({
      ...prevFields,
      [name]: true,
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setHighlightedFields((prevFields) => ({
      ...prevFields,
      [name]: value !== '',
    }));
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    // You can add more conditions like requiring uppercase, lowercase, digits, special characters, etc.
    // Example conditions:
    // if (!password.match(/[A-Z]/)) {
    //   return 'Password must contain at least one uppercase letter.';
    // }
    // if (!password.match(/[a-z]/)) {
    //   return 'Password must contain at least one lowercase letter.';
    // }
    // if (!password.match(/[0-9]/)) {
    //   return 'Password must contain at least one digit.';
    // }
    // if (!password.match(/[!@#$%^&*(),.?":{}|<>]/)) {
    //   return 'Password must contain at least one special character.';
    // }
    return '';
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formFields;
    
    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setPasswordError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    
    axios.post("http://localhost:5000/register", formFields)
      .then(res => {
        alert(res.data);
        // Clear form fields
        setFormFields({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        setPasswordError('');
        navigate('/login');
      })
      .catch(err => {
        console.error(err);
        // Handle registration error, show error message, etc.
      });
  };

  return (
    <div className="form">
      <h1>Sign Up for Free</h1>
      <form onSubmit={submitHandler}>
        <div className="top-row">
          <div className={`field-wrap ${highlightedFields.username ? 'highlight' : ''}`}>
            <label className={formFields.username ? 'active' : ''}>
              Username<span className="req">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formFields.username}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              autoComplete="off"
            />
          </div>
          <div className={`field-wrap ${highlightedFields.email ? 'highlight' : ''}`}>
            <label className={formFields.email ? 'active' : ''}>
              Email Address<span className="req">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formFields.email}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              autoComplete="off"
            />
          </div>
        </div>
        <div className={`field-wrap ${highlightedFields.password ? 'highlight' : ''}`}>
          <label className={formFields.password ? 'active' : ''}>
            Password<span className="req">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formFields.password}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required
            autoComplete="off"
          />
        </div>
        <div className={`field-wrap ${highlightedFields.confirmPassword ? 'highlight' : ''}`}>
          <label className={formFields.confirmPassword ? 'active' : ''}>
            Confirm Password<span className="req">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formFields.confirmPassword}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required
            autoComplete="off"
          />
        </div>
        {passwordError && <p className="error">{passwordError}</p>}
        <button type="submit" className="button button-block">Get Started</button>
      </form>
    </div>
  );
};

export default SignUpForm;
