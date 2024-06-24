import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { RecipeContext } from '../App';
import { FaSearch } from 'react-icons/fa'; // Import search icon


const MainContent = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const { setRecipeID } = useContext(RecipeContext);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/recipes');
        setRecipes(response.data);
        setFilteredRecipes(response.data); // Initialize with all recipes
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  }, []);

  const handleRecipeClick = (id) => {
    setRecipeID(id);
  };

  const handleSearch = () => {
    const filtered = recipes.filter((recipe) =>
      recipe.recipeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  return (
    <div id="main">
      <div className="inner">
        <header>
          <h1 className="custom-h1">Find Inspiration for Every Meal with FavourFusion.</h1>
          <p className="custom-p">"Whether you're planning a quick weekday dinner or an extravagant weekend feast, FavourFusion offers a treasure trove of recipes to spark your creativity and satisfy your taste buds. Discover delicious possibilities for breakfast, lunch, dinner, and everything in between."</p>
        </header>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a recipe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="search-icon" onClick={handleSearch} />
        </div>
        <section className="tiles">
          {filteredRecipes.map((recipe) => (
            <article key={recipe._id} className="style1">
              <span className="image square-image">
                <img src={recipe.imagePath} alt={recipe.recipeName} />
              </span>
              <Link to="/all" onClick={() => handleRecipeClick(recipe._id)}>
                <h2>{recipe.recipeName}</h2>
                <div className="content">
                  {/* <p>
                    Recipe by <strong style={{ textTransform: 'capitalize' }}></strong>
                  </p> */}
                </div>
              </Link>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default MainContent;
