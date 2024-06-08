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

  return (
    <div>
      {data && (
        <center>
          <p>Welcome User: {data.username}</p>
          <p>SECRET HAI BOHOT BADA</p>
          <button onClick={handleLogout}>Logout</button>
        </center>
      )}
    </div>
  );
};

export default MyProfile;
