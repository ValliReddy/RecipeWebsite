import React, { useContext, useState, useEffect } from 'react';
import { store } from '../App'; // Adjust the import path if necessary
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyProfile = () => {
  const navigate = useNavigate();
  const [token, setToken] = useContext(store);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let storedToken = token || localStorage.getItem('token');
        
        if (storedToken) {
          const response = await axios.get("http://localhost:5000/myprofile", {
            headers: {
              'x-token': storedToken
            }
          });
          setData(response.data);
          if (!token) {
            setToken(storedToken); // Set token in context if not already set
          }
        } else {
          // If token is not available, navigate to the login page
          navigate('/login');
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        navigate('/login'); // Navigate to login on error
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    setToken(null); // Clear token from context
    navigate('/login'); // Redirect to login page
  };

  // Inline styles for .gradient-custom
  const gradientCustomStyles = {
    background: '#f6d365', /* fallback for old browsers */
    background: 'linear-gradient(to right bottom, rgba(246, 211, 101, 1), rgba(253, 160, 133, 1))'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {data && (
        <div>
          <section style={{ backgroundColor: '#f4f5f7', padding: '40px' }}>
            <div className="container">
              <div className="row d-flex justify-content-center">
                <div className="col-lg-6">
                  <div className="card mb-3" style={{ borderRadius: '.5rem', boxShadow: '0 0.75rem 1.5rem rgba(18,38,63,.03)' }}>
                    <div className="row g-0">
                      <div className="col-md-12 text-center text-white mb-3" style={{ ...gradientCustomStyles, borderRadius: '.5rem 0 0 .5rem', padding: '20px' }}>
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                          alt="Avatar" className="img-fluid my-3" style={{ width: '120px', borderRadius: '50%' }} />
                        <h5>Marie Horwitz</h5>
                        <p>Web Designer</p>
                        <div className="d-flex justify-content-center">
                          <a href="#!" style={{ marginRight: '10px' }}><i className="fab fa-facebook-f fa-lg"></i></a>
                          <a href="#!" style={{ marginRight: '10px' }}><i className="fab fa-twitter fa-lg"></i></a>
                          <a href="#!"><i className="fab fa-instagram fa-lg"></i></a>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="card-body p-4">
                          <h6>Information</h6>
                          <hr className="mt-0 mb-4" />
                          <div className="row pt-1">
                            <div className="col-6 mb-3">
                              <h6>Email</h6>
                              <p className="text-muted">info@example.com</p>
                            </div>
                            <div className="col-6 mb-3">
                              <h6>Phone</h6>
                              <p className="text-muted">123 456 789</p>
                            </div>
                          </div>
                          <h6>Projects</h6>
                          <hr className="mt-0 mb-4" />
                          <div className="row pt-1">
                            <div className="col-6 mb-3">
                              <h6>Recent</h6>
                              <p className="text-muted">Lorem ipsum</p>
                            </div>
                            <div className="col-6 mb-3">
                              <h6>Most Viewed</h6>
                              <p className="text-muted">Dolor sit amet</p>
                            </div>
                          </div>
                          <div className="text-center mt-4">
                            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
