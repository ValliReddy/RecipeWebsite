import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Newsletter = () => {
  const [recipes, setRecipes] = useState([]);
  const [maxRatedRecipe, setMaxRatedRecipe] = useState(null);
  const [maxRating, setMaxRating] = useState(-Infinity);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/recipes'); // Adjust the URL as necessary
        setRecipes(res.data);

        // Find the recipe with the maximum rating
        let maxRecipe = null;
        let maxRecipeRating = -Infinity;
        res.data.forEach(recipe => {
          const recipeRating = recipe.ratings; // Assuming ratings is a single number
          if (typeof recipeRating === 'number') {
            if (recipeRating > maxRecipeRating) {
              maxRecipe = recipe;
              maxRecipeRating = recipeRating;
            }
          }
        });

        if (maxRecipe) {
          setMaxRatedRecipe(maxRecipe);
          setMaxRating(maxRecipeRating);
          console.log(`Recipe with max rating: ${maxRecipe.recipeName}`);
        } else {
          setError("No recipes found or error fetching data.");
        }
      } catch (err) {
        console.error('Error fetching recipes', err);
        setError("Error fetching recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Show loading indicator while fetching data
  if (loading) {
    return <p>Loading...</p>;
  }

  // Show error message if there's an error
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {maxRatedRecipe && <p>Highest Rated: {maxRatedRecipe.recipeName}</p>}
    </div>
  );
};

export default Newsletter;
