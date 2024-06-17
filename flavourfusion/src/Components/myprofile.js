import React, { useContext, useState, useEffect } from 'react';
import { store } from '../App'; // Adjust the import path if necessary
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecipeForm from './RecipeC'; // Adjust the import path for RecipeForm

const MyProfile = () => {
  const navigate = useNavigate();
  const [token, setToken] = useContext(store);
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(false);

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
  }, [token, navigate, setToken]);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    setToken(null); // Clear token from context
    navigate('/login'); // Redirect to login page
  };

  const handleRecipe = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false); // Set showForm state to false to close the form
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'left', alignItems: 'left' }}>
      {data && (
        <>
          {/* Existing card on the left */}
          <div style={{ width: '50%', padding: '40px' }}>
            <div className="card mb-3" style={{ borderRadius: '.5rem', background: '#fffffb', boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)' }}>
              <div className="row g-0">
                <div className="col-md-12 text-center text-white mb-3" style={{ background: 'linear-gradient(to right bottom, rgba(246, 211, 101, 1), rgba(253, 160, 133, 1))', borderRadius: '.5rem 0 0 .5rem', padding: '20px' }}>
                  <img src="./images/chef.png" alt="Avatar" className="img-fluid my-3" style={{ width: '120px', borderRadius: '50%' }} />
                  <center><h3>Chef</h3></center>
                  <div className="d-flex justify-content-center">
                    <a href="#!" style={{ marginRight: '20px' }}><i className="fab fa-facebook-f fa-lg"></i></a>
                    <a href="#!" style={{ marginRight: '20px' }}><i className="fab fa-twitter fa-lg"></i></a>
                    <a href="#!"><i className="fab fa-instagram fa-lg"></i></a>
                  </div>
                  <div className="text-center mt-4">
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="card-body p-4">
                    <h6>Information</h6>
                    <p>ID: {data._id}</p>
                    <hr className="mt-0 mb-4" />
                    <div className="row pt-1">
                      <div className="col-6 mb-3">
                        <h6>Email</h6>
                        <p className="text-muted">{data.email}</p>
                      </div>
                      <div className="col-6 mb-3">
                        <h6>Recipes</h6>
                        <p className="text-muted">0</p>
                      </div>
                    </div>
                    <hr className="mt-0 mb-4" />
                    <div className="row pt-1">
                      <div className="col-6 mb-3">
                        <h6>Followers</h6>
                        <p className="text-muted">100</p>
                      </div>
                      <div className="col-6 mb-3">
                        <h6>Ratings</h6>
                        <p className="text-muted">4.5</p>
                      </div>
                    </div>
                    <div className="text-center mt-4">
                      <button className="btn btn-danger" onClick={handleRecipe}>Add your own recipe</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* New card on the right for the form */}
          {showForm && (
            <div style={{ width: '50%', padding: '40px' }}>
              <div className="card mb-3" style={{ borderRadius: '.5rem', background: '#fffffb', boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)' }}>
                <div className="card-body p-4">
                  <RecipeForm open={true} setCloseForm={handleCloseForm} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyProfile;
