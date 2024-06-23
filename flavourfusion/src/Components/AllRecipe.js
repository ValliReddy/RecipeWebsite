import React, { useRef, useState, useEffect, useContext } from 'react';
import { useReactToPrint } from 'react-to-print';
import CommentSection from './Comments';
import axios from 'axios';
import { RecipeContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { store } from '../App';

const All = () => {
  const { recipeID } = useContext(RecipeContext);
  const navigate = useNavigate();
  const componentRef = useRef();
  const [token] = useContext(store); 
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authorID, setAuthorID] = useState(null);
  const [profileData, setProfileData] = useState({
    username: '',
    followers: '',
    ratings: '',
    about: '',
    profileImage: '',
    socialMedia: {
      instagram: '',
      twitter: '',
      facebook: ''
    }
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followButtonDisabled, setFollowButtonDisabled] = useState(false);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/recipes/${recipeID}`);
      setRecipe(response.data);
      setAuthorID(response.data.Author); //who writes recipe store authorid
      console.log(response.data.Author)
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      if (authorID) {
        const response = await axios.get(`http://localhost:5000/edit-profile/${authorID}`);
        setProfileData(response.data);
        setFollowersCount(response.data.followers);
        setIsFollowing(response.data.isFollowing); // Assuming backend returns if current user is following
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleFollow = async () => {
    try {
      const storedToken = token || localStorage.getItem('token');

      if (!storedToken) {
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          'x-token': storedToken
        }
      };

      const response = await axios.post(
        `http://localhost:5000/follow/${authorID}`,
        null,
        config
      );

      if (response.status === 200) {
        setIsFollowing(true);
        setFollowersCount(response.data.followersCount);
        setFollowButtonDisabled(true);
      } else if (response.status === 400 && response.data.message === 'You have already followed this user') {
        console.log('User is already following this profile'); // Optionally handle this case
      } else {
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      console.error('Error following profile:', error);
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
    }
  };

  useEffect(() => {
    if (recipeID) {
      fetchRecipe();
    }
  }, [recipeID]);

  useEffect(() => {
    if (authorID) {
      fetchProfile();
    }
  }, [authorID, isFollowing]); // Update when following status changes

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
    <div className="container" style={{justifyContent:'center',alignContent:'center'}}>
      <div className="menu-card">
        <div className="card" ref={componentRef}>
          <div className="inner">
            <h1>{recipe.recipeName}</h1>
            <span className="image main">
              <center><img src={recipe.imagePath} alt="Recipe Image" style={{ width: '50%', maxWidth: '700px' }} onError={(e) => console.log('Image Error:', e)} /></center>
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
      <div className="new-profile-img" style={{ backgroundImage: `url(${profileData.profileImage})` }}></div>
      <h1 className="new-profile-name">
        {profileData.username}
      </h1>
      <div className="new-description">
        {profileData.about}
      </div>
      <button onClick={handleFollow} disabled={followButtonDisabled}>
        {isFollowing ? 'Following' : 'Follow'}
      </button>
      <div className="new-followers">
        <span className="label">Followers:</span> <span className="value">{profileData.followersCount}</span>
      </div>
      <div className="new-ratings">
        <span className="label">Ratings:</span> <span className="value">{profileData.ratings}</span>
      </div>
      <div className="social-icons">
        <a href={`https://www.instagram.com/${profileData.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram" style={{ color: '#E4405F' }}></i>
        </a>
        <a href={`https://www.twitter.com/${profileData.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter" style={{ color: '#1DA1F2' }}></i>
        </a>
        <a href={`https://www.facebook.com/${profileData.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook" style={{ color: '#1877F2' }}></i>
        </a>
      </div>
    </div>

    </div>
  );
};

export default All;
