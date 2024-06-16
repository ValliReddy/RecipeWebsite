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
    return <p>Error fetching recipe: {error}</p>;
  }

  if (!recipe) {
    return <p>No recipe found</p>;
  }

  return (
    <div className="menu-card">
      <div className="card" ref={componentRef}>
        <div className="inner">
          <h1>{recipe.recipeName}</h1>
          <span className="image main">
            {/* Ensure imagePath is correct */}
            <img src={recipe.imagePath} alt="Recipe Image" style={{ width: '50%', maxWidth: '700px' }} onError={(e) => console.log('Image Error:', e)} />
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
  );
};

export default All;
