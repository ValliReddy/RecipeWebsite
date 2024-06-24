import React, { useContext, useState, useEffect } from 'react';
import './Myprofile.css'; // Import your CSS file for styling
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecipeForm from './RecipeC';
import { store } from '../App';
import '@fortawesome/react-fontawesome';




const  MyProfile = () => {
  const navigate = useNavigate();
  const [token, setToken] = useContext(store);
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [userID, setUserID] = useState(null);
  const [ProfileData, setProfileData] = useState('');
  const [userRecipes, setUserRecipes] = useState([]);
  const [showRecipes, setShowRecipes] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });

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
          // console.log(response.data)
          if (!token) {
            setToken(storedToken);
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        navigate('/login');
      }
    };

    fetchData();
  }, [token, navigate, setToken]);

  useEffect(() => {
    if (data) {
      setUserID(data._id);

    }
  }, [data]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/edit-profile/${userID}`);
        setProfileData(response.data);
        const recipesResponse = await axios.get(`http://localhost:5000/recipes/user/${userID}`);
        setUserRecipes(recipesResponse.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    if (userID) {
      fetchProfile();
    }
  }, [userID]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  const handleRecipe = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleEditProfile = () => {
    navigate('/editprofile', { state: { userID: userID, ProfileData: ProfileData } });
  };

  const toggleRecipes = () => {
    setShowRecipes(!showRecipes);
  };

  const handleEditRecipe = (recipeID) => {
    // Add functionality to edit recipe
    console.log(`Edit recipe with ID: ${recipeID}`);
  };

  const handleDeleteRecipe = (recipeID) => {
    // Add functionality to delete recipe
    console.log(`Delete recipe with ID: ${recipeID}`);
  };

  return (
    <div className="container">
      <div class="inner">
        <section id="banner">
          <div className="content">
            <header>
              <h1>Welcome to Flavour Fusion, {ProfileData.username}!</h1>
              <p>Setup profile here:
                <a 
                  onClick={handleEditProfile} 
                  className="btn-sm btn-block" 
                  style={{ color: '#f56a6a' }}
                >
                  Edit profile
                </a>
              </p>
            </header>
            <p>Welcome to your FavourFusion, where culinary creativity meets community! This is your space to explore, create, and share your favorite fusion recipes. Whether you're combining flavors from around the world or adding your own unique twist to traditional dishes, the possibilities are endless. Dive in and start by creating your own recipes to inspire others. Engage with fellow chefs by commenting on their creations, offering tips, and rating recipes you've tried. Don't forget to explore and follow recipes that pique your interest—you never know what delicious inspiration awaits! Together, let's celebrate the joy of cooking and sharing wonderful flavors.</p>
            <div className="text-center mt-4">
              <button className="button big" onClick={handleRecipe}>Add your own recipe</button>
            </div>
          </div>
          <span className="image object">
            <img src={ProfileData.profileImage} alt="" />
            <div className="text-center mt-6">
              <center>
                <button className="button big"
                  style={{ marginTop: '10px' }} 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </center>
            </div>
          </span>
        </section>
        
        <section>
          <header className="major">
            <h2>Information</h2>
          </header>
          <div className="features">
            <article>
              <span className="icon fas fa-heart"></span>
              <div className="content">
                <h3>Followers</h3>
                <p><strong>{ProfileData.followersCount}</strong></p>
              </div>
            </article>
            <article>
              <span className="icon fas fa-star"></span>
              <div className="content">
                <h3>Ratings</h3>
                <p><strong>{ProfileData.ratings}</strong></p>
              </div>
            </article>
            <article>
            <span className="icon solid fa-signal"></span> 
                <div className="content">
                <h3>No of recipes</h3>
                <p><strong>{ProfileData.recipeCount}</strong></p>
              </div>
            </article>
            {data && (
            <article>
            <span className="icon fas fa-envelope"></span>
              <div className="content">
                <h3>Email</h3>
                <p>{data.email}</p>
              </div>
            </article>
            )}
          </div>
        </section>
        <section>
  <header className="major">
    <h2>Your Recipes</h2>
  </header>
  {userRecipes.length > 0 ? (
    <div className="posts">
      {userRecipes.map(recipe => (
        <article key={recipe._id}>
          <a href="#" className="image">
            <img 
              src={recipe.imagePath} 
              alt="" 
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />
          </a>
          <h3>{recipe.recipeName}</h3>
          {/* <p>{recipe.description}</p> */}
          <ul className="actions">
            <li><a href="#" className="button" onClick={() => handleEditRecipe(recipe._id)}>Edit</a></li>
            <li><a href="#" className="button" onClick={() => handleDeleteRecipe(recipe._id)}>Delete</a></li>
          </ul>
        </article>
      ))}
    </div>
  ) : (
    <p>No recipes found.</p>
  )}
</section>


        {/* <section>
        <header className="major">
          <h2>Your Recipes</h2>
        </header>
        {userRecipes.length > 0 ? (
        userRecipes.map(recipe => (
        <div className="posts">
          <article>
            <a href="#" className="image"><img src="images/pic03.jpg" alt="" /></a>
            <h3>Interdum aenean</h3>
            <p>Aenean ornare velit lacus, ac varius enim lorem ullamcorper dolore. Proin aliquam facilisis ante interdum. Sed nulla amet lorem feugiat tempus aliquam.</p>
            <ul className="actions">
            <li><a href="#" className="button" onClick={() => handleEditRecipe()}>Edit</a></li>
            <li><a href="#" className="button" onClick={() => handleDeleteRecipe()}>Delete</a></li>
            </ul>
          </article>
        ))
                  ) : (
                    <p>No recipes found.</p>
                  )}
                  </div>
          <article>
            <a href="#" className="image"><img src="images/pic03.jpg" alt="" /></a>
            <h3>Nulla amet dolore</h3>
            <p>Aenean ornare velit lacus, ac varius enim lorem ullamcorper dolore. Proin aliquam facilisis ante interdum. Sed nulla amet lorem feugiat tempus aliquam.</p>
            <ul className="actions">
              <li><a href="#" className="button">More</a></li>
            </ul>
          </article>
          <article>
            <a href="#" className="image"><img src="images/pic03.jpg" alt="" /></a>
            <h3>Tempus ullamcorper</h3>
            <p>Aenean ornare velit lacus, ac varius enim lorem ullamcorper dolore. Proin aliquam facilisis ante interdum. Sed nulla amet lorem feugiat tempus aliquam.</p>
            <ul className="actions">
              <li><a href="#" className="button">More</a></li>
            </ul>
          </article>
          <article>
            <a href="#" className="image"><img src="images/pic04.jpg" alt="" /></a>
            <h3>Sed etiam facilis</h3>
            <p>Aenean ornare velit lacus, ac varius enim lorem ullamcorper dolore. Proin aliquam facilisis ante interdum. Sed nulla amet lorem feugiat tempus aliquam.</p>
            <ul className="actions">
              <li><a href="#" className="button">More</a></li>
            </ul>
          </article>
          <article>
            <a href="#" className="image"><img src="images/pic05.jpg" alt="" /></a>
            <h3>Feugiat lorem aenean</h3>
            <p>Aenean ornare velit lacus, ac varius enim lorem ullamcorper dolore. Proin aliquam facilisis ante interdum. Sed nulla amet lorem feugiat tempus aliquam.</p>
            <ul className="actions">
              <li><a href="#" className="button">More</a></li>
            </ul>
          </article>
          <article>
            <a href="#" className="image"><img src="images/pic06.jpg" alt="" /></a>
            <h3>Amet varius aliquam</h3>
            <p>Aenean ornare velit lacus, ac varius enim lorem ullamcorper dolore. Proin aliquam facilisis ante interdum. Sed nulla amet lorem feugiat tempus aliquam.</p>
            <ul className="actions">
              <li><a href="#" className="button">More</a></li>
            </ul>
          </article>
        </div>
      </section> */}
      </div>
      {showForm && userID && (
        <div className="overlay" >
          <div className="form-container" style={modalPosition}>
            {/* <button className="close-btn" onClick={handleCloseForm}>Close</button> */}
            <RecipeForm open={true} userID={userID} setCloseForm={handleCloseForm} />
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProfile;
