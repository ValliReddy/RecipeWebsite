// Footer.js
import React, { useState } from 'react';
import axios from 'axios';
import Notification from './Notification';

const Footer = () => {
	const [name, setName] = useState('');
    const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/newsletter-signup', { name, email });
      setMessage(response.data.message);
	  setName('');
      setEmail('');

    } catch (error) {
		setMessage(error.response.data.error);
    }
  };
  return (
    <footer id="footer">
      <div className="inner">
        <section>
          <h2>Signup for email updates</h2>
		  <h3>Get our top rated recipe</h3>
          <form onSubmit={handleSubmit}>
									<div class="fields">
										<div class="field half">
										<input
											type="text"
											name="name"
											id="name"
											placeholder="Name"
											value={name}
											onChange={(e) => setName(e.target.value)}
											/>
										</div>
										<div class="field half">
										<input
											type="email"
											name="email"
											id="email"
											placeholder="Email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											/>
										</div>
										{/* <div class="field">
											<textarea name="message" id="message" placeholder="Message"></textarea>
										</div> */}
									</div>
									<ul class="actions">
										<li><input type="submit" value="Send" class="primary" /></li>
									</ul>
								</form>
        </section>
        <section>
          <h2>Follow</h2>
          <ul class="icons">
									<li><a  class="icon brands style2 fa-twitter"><span class="label">Twitter</span></a></li>
									<li><a class="icon brands style2 fa-facebook-f"><span class="label">Facebook</span></a></li>
									<li><a  class="icon brands style2 fa-instagram"><span class="label">Instagram</span></a></li>
									<li><a  class="icon brands style2 fa-dribbble"><span class="label">Dribbble</span></a></li>
									<li><a  class="icon brands style2 fa-github"><span class="label">GitHub</span></a></li>
									<li><a  class="icon brands style2 fa-500px"><span class="label">500px</span></a></li>
									<li><a class="icon solid style2 fa-phone"><span class="label">Phone</span></a></li>
									<li><a  class="icon solid style2 fa-envelope"><span class="label">Email</span></a></li>
								</ul>
        </section>
        <ul className="copyright">
           <li>&copy; Favour Fusion. All rights reserved</li><li>Design: <a>Valli Reddy</a></li> {/*porfolio link here */}
        </ul>
      </div>
	  {message && (
          <Notification
            message={message}
          />
        )}
    </footer>
  );
}

export default Footer;
