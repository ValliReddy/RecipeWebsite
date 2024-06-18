import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header'; // Adjust the import path if necessary
import MainContent from './Components/Main'; // Adjust the import path if necessary
import Footer from './Components/Footer'; // Adjust the import path if necessary
import './App.css'; // Import CSS styles for your components
import SignUp from './Components/signup'; // Adjust the import path if necessary
import Login from './Components/Login';
import Biryani from './Components/Biryani';
import MyProfile from './Components/myprofile';
import All from './Components/AllRecipe';
import EditProfile from './Components/EditProfile';

export const store = createContext();
export const RecipeContext = createContext();

const App = () => {
  const [token, setToken] = useState(null);
  const [recipeID, setRecipeID] = useState('');

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
          <RecipeContext.Provider value={{ recipeID, setRecipeID }}>
            <Header token={token} />
            <Routes>
              <Route path="/" element={<MainContent />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/biryani" element={<Biryani />} />
              <Route path="/myprofile" element={<MyProfile />} />
              <Route path="/all" element={<All />} />
              <Route path="/editprofile" element={<EditProfile/>} />
            </Routes>
            <Footer />
          </RecipeContext.Provider>
        </store.Provider>
      </div>
    </Router>
  );
};

export default App;
