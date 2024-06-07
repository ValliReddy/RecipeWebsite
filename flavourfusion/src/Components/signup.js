import React, { useState } from 'react';
import './SignUp.css'; // Import the CSS file
import axios from 'axios';


const SignUpForm = () => {
  const [formFields, setFormFields] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [highlightedFields, setHighlightedFields] = useState({});

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

  const submitHandler = (e) => {
    e.preventDefault();
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
        <button type="submit" className="button button-block">Get Started</button>
      </form>
    </div>
  );
};

export default SignUpForm;
