// SignUp.js
import React, { useState, useEffect } from 'react';
import './SignUp.css'; // Import the CSS file


const Login = () => {
  const [activeTab, setActiveTab] = useState('signup');

  useEffect(() => {
    const handleInput = (e) => {
      const $this = e.target;
      const label = $this.previousElementSibling;

      if (e.type === 'keyup') {
        if ($this.value === '') {
          label.classList.remove('active', 'highlight');
        } else {
          label.classList.add('active', 'highlight');
        }
      } else if (e.type === 'blur') {
        if ($this.value === '') {
          label.classList.remove('active', 'highlight');
        } else {
          label.classList.remove('highlight');
        }
      } else if (e.type === 'focus') {
        if ($this.value === '') {
          label.classList.remove('highlight');
        } else {
          label.classList.add('highlight');
        }
      }
    };

    const handleTabClick = (e) => {
      e.preventDefault();

      const tab = e.currentTarget.parentElement;
      const target = e.currentTarget.getAttribute('href');

      tab.classList.add('active');
      [...tab.parentElement.children].forEach((sibling) => {
        if (sibling !== tab) {
          sibling.classList.remove('active');
        }
      });

      document.querySelectorAll('.tab-content > div').forEach((content) => {
        if (`#${content.id}` === target) {
          content.style.display = 'block';
        } else {
          content.style.display = 'none';
        }
      });
    };

    document.querySelectorAll('.form input, .form textarea').forEach((el) => {
      el.addEventListener('keyup', handleInput);
      el.addEventListener('blur', handleInput);
      el.addEventListener('focus', handleInput);
    });

    document.querySelectorAll('.tab a').forEach((el) => {
      el.addEventListener('click', handleTabClick);
    });

    // Clean up event listeners
    return () => {
      document.querySelectorAll('.form input, .form textarea').forEach((el) => {
        el.removeEventListener('keyup', handleInput);
        el.removeEventListener('blur', handleInput);
        el.removeEventListener('focus', handleInput);
      });

      document.querySelectorAll('.tab a').forEach((el) => {
        el.removeEventListener('click', handleTabClick);
      });
    };
  }, []);

  return (
    <div className="form">
      <ul className="tab-group">
        <li className={`tab ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => setActiveTab('signup')}>
          <a href="#signup">Sign Up</a>
        </li>
        <li className={`tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>
          <a href="#login">Log In</a>
        </li>
      </ul>

      <div className="tab-content">
        <div id="signup" style={{ display: activeTab === 'signup' ? 'block' : 'none' }}>
          <h1>Sign Up for Free</h1>
          <form action="/" method="post">
            <div className="top-row">
              <div className="field-wrap">
                <label>
                  First Name<span className="req">*</span>
                </label>
                <input type="text" required autoComplete="off" />
              </div>
              <div className="field-wrap">
                <label>
                  Last Name<span className="req">*</span>
                </label>
                <input type="text" required autoComplete="off" />
              </div>
            </div>
            <div className="field-wrap">
              <label>
                Email Address<span className="req">*</span>
              </label>
              <input type="email" required autoComplete="off" />
            </div>
            <div className="field-wrap">
              <label>
                Set A Password<span className="req">*</span>
              </label>
              <input type="password" required autoComplete="off" />
            </div>
            <button type="submit" className="button button-block">Get Started</button>
          </form>
        </div>

        <div id="login" style={{ display: activeTab === 'login' ? 'block' : 'none' }}>
          <h1>Welcome Back!</h1>
          <form action="/" method="post">
            <div className="field-wrap">
              <label>
                Email Address<span className="req">*</span>
              </label>
              <input type="email" required autoComplete="off" />
            </div>
            <div className="field-wrap">
              <label>
                Password<span className="req">*</span>
              </label>
              <input type="password" required autoComplete="off" />
            </div>
            <p className="forgot"><a href="#">Forgot Password?</a></p>
            <button className="button button-block">Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
