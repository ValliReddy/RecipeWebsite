// App.js
import React, { useState, useEffect } from 'react';
import Header from './Components/Header'; // Adjust the import path if necessary
import MainContent from './Components/Main'; // Adjust the import path if necessary
import Footer from './Components/Footer'; // Adjust the import path if necessary
import './App.css'; // Import CSS styles for your components
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './Components/signup'; // Adjust the import path if necessary
import Login from './Components/Login';
import Biryani from './Components/Biryani';
import { createContext } from 'react';
import MyProfile from './Components/myprofile';
import All from './Components/AllRecipe';

export const store = createContext();
const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <Router>
      <div id="wrapper">
        <store.Provider value={[token, setToken]}>
          <Header token={token} />
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/biryani" element={<Biryani />} />
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/all" element={<All/>} />
          </Routes>
          <Footer />
        </store.Provider>
      </div>
    </Router>
  );
};

export default App;
