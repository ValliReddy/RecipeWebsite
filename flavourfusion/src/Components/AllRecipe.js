// All.js

import React, { useRef, useState, useEffect, useContext } from 'react';
import { useReactToPrint } from 'react-to-print';
import CommentSection from './Comments';
import axios from 'axios';
import { RecipeContext } from '../App';

const All = () => {
  const { recipeID } = useContext(RecipeContext);
  const componentRef = useRef();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/recipes/${recipeID}`);
      setRecipe(response.data);
      console.log('Fetched recipe:', response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recipeID) {
      fetchRecipe();
    }
  }, [recipeID]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (loading) {
    return <p><center><h4>Loading recipe...</h4></center></p>;
  }

  if (error) {
    return <p><center><h4>Error fetching recipe: {error}</h4></center></p>;
  }

  if (!recipe) {
    return <p><center><h4>No recipe found</h4></center></p>;
  }

  return (
    <div className="container">
      <div className="menu-card">
        <div className="card" ref={componentRef}>
          <div className="inner">
            <h1>{recipe.recipeName}</h1>
            <span className="image main">
              <center><img src={recipe.imagePath} alt="Recipe Image" style={{width: '50%', maxWidth: '700px' }} onError={(e) => console.log('Image Error:', e)} /></center>
            </span>
            <h2>Ingredients:</h2>
            <ul>
              {recipe.ingredients.split('\r\n').map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h2>Instructions:</h2>
            <ol>
              {recipe.instructions.split('\r\n').map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
        <div className="recipe-actions">
          <button className="recipe" onClick={handlePrint}>
            Print Recipe
          </button>
          <h2>Leave a comment</h2>
          <CommentSection />
        </div>
      </div>
      <div className="new-login-container">
        <div className="new-profile-img"></div>
        <h1 className="new-profile-name">
         {recipe.Author}
        </h1>
        <div className="new-description">
        A passionate chef who loves cooking, exploring new recipes, and sharing culinary experiences.
        </div>
        <button className="new-follow-button">
          <i className='fa fa-heart'></i> Follow
        </button>
        <div className="new-followers">
          <span className="label">Followers:</span> <span className="value">1.5K</span>
        </div>
        <div className="new-ratings">
          <span className="label">Ratings:</span> <span className="value">4.8/5</span>
        </div>
      </div>
    </div>
  );
};

export default All;
