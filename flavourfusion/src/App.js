// App.js
import React from 'react';
import Header from './Components/Header'; // Adjust the import path if necessary
import MainContent from './Components/Main'; // Adjust the import path if necessary
import Footer from './Components/Footer'; // Adjust the import path if necessary
import './App.css'; // Import CSS styles for your components
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './Components/signup'; // Adjust the import path if necessary
import Login from './Components/Login';
import Biryani from './Components/Biryani';

const App = () => (
  <Router>
    <div id="wrapper">
      <Header />
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/signup" element={<SignUp />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/biryani" element={<Biryani/>} /> 
      </Routes>
      <Footer />
    </div>
  </Router>
);

export default App;
