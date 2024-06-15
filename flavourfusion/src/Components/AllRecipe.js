import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import CommentSection from './Comments';
import axios from 'axios'; // Import axios for making HTTP requests

const All = () => {
  const componentRef = useRef();

  // State to hold recipe data
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch recipe data
  const fetchRecipe = async () => {
    try {
      const response = await axios.get('http://localhost:5000/recipes/666d8ef69e022173b2467d7c'); // Replace with your backend endpoint
      setRecipe(response.data); 
    //   console.log('Recipe ID:', recipe._id);
      console.log(response.data);// Assuming your API returns recipe data in JSON format
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Fetch recipe data on component mount
  useEffect(() => {
    fetchRecipe();
  }, []);

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
            <img src={`http://localhost:5000/${recipe.imagePath}`} alt="" style={{ width: '50%', maxWidth: '700px' }} />
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
        {/* Button to toggle comment visibility */}
        <h2>Leave a comment</h2>
        <CommentSection recipeID={recipe._id} />
      </div>
    </div>
  );
};

export default All;
