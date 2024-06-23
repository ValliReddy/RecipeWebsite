const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const middleware = require('./middleware');


const RegisterUser = require('./models/RegisterUser');
const Comment = require('./models/Comment');
const Recipe = require('./models/RecipeSchema');
const EditProfile = require('./models/EditSchema');

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));



mongoose.connect("mongodb+srv://vallirani:NewPass@cluster0.ykmsdrg.mongodb.net/React-nodeDB?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("DB connected successfully"));

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dyf5rmdgy',
  api_key: '291131827599212',
  api_secret: 'qDvPF8PHD_lOyEdXcByxqEAX1L4'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'recipes',
    allowed_formats: ['jpg', 'jpeg', 'png']
  }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        let exist = await RegisterUser.findOne({ email: email });
        if (exist) {
            return res.status(400).send('User Already Exist');
        }
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords are not matching');
        }
        let newUser = new RegisterUser({
            username,
            email,
            password,
            confirmPassword
        });
        await newUser.save();
        res.status(200).send('Registered Successfully');
        // res.status(200).json(newUser._id);
        
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let exist = await RegisterUser.findOne({ email: email });
        if (!exist) {
            return res.status(400).send('User not found');
        }
        if (exist.password !== password) {
            return res.status(400).send('Invalid credentials');
        }
        let payload = {
            user: {
                id: exist.id
            }
        };
        jwt.sign(payload, 'jwtsecret', { expiresIn: 3600000 }, (err, token) => {
            if (err) throw err;
            return res.json({ token });
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error');
    }
});

app.get('/myprofile', middleware, async (req, res) => {
    try {
        let exist = await RegisterUser.findById(req.user.id);
        if (!exist) {
            return res.status(400).send('User not found');
        }
        res.json(exist);
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error');
    }
});

// Route to get comments for a specific post
app.get('/comments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await Comment.find({ recipe: id }).populate('user', 'username');
        res.json(comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/comments', middleware, async (req, res) => {
    try {
        const { recipe, content, rating } = req.body; // Include rating in the request body
        const newComment = new Comment({
            // recipe:req.recipe.id,
            recipe,
            user: req.user.id,
            content,
            rating // Save the rating
        });
        await newComment.save();

        // Send the ID of the newly created comment in the response
        res.status(201).json({ commentId: newComment._id, message: 'Comment added successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Submit a new recipe endpoint
app.post('/submit-recipe', upload.single('recipeImage'), async (req, res) => {
    try {
        const { Author,recipeName, ingredients, instructions } = req.body;
        const imagePath = req.file ? req.file.path : null;
        const newRecipe = new Recipe({
            Author,
            recipeName,
            ingredients,
            instructions,
            imagePath
        });
        await newRecipe.save();
        res.status(201).json({ message: 'Recipe submitted successfully', recipe: newRecipe });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all recipes endpoint
app.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get recipe by ID endpoint
app.get('/recipes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }
        res.json(recipe);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.get('/recipes/user/:userID', async (req, res) => {
    try {
      const { userID } = req.params;
      const recipes = await Recipe.find({ Author: userID }); // Assuming author field in Recipe model stores user ID
      res.json(recipes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

app.get('/edit-profile/:userId', async (req, res) => {
    try {
        const editProfile = await EditProfile.findOne({ userId: req.params.userId });
        if (!editProfile) {
            return res.status(404).json({ msg: 'Edit profile not found' });
        }
        res.json(editProfile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
app.post('/edit-profile/:userId', upload.single('profileImage'), async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, about, facebook, twitter, instagram } = req.body;

        let editProfile = await EditProfile.findOne({ userId });

        if (editProfile) {
            // Update existing edit profile
            editProfile.username = username;
            editProfile.about = about;
            editProfile.socialMedia = { facebook, twitter, instagram };

            // Handle profile image upload if present
            if (req.file && req.file.path) {
                editProfile.profileImage = req.file.path;
            }

            await editProfile.save();
        } else {
            // Create new edit profile
            const profileImage = req.file ? req.file.path : undefined;
            editProfile = new EditProfile({
                userId,
                username,
                about,
                profileImage,
                socialMedia: { facebook, twitter, instagram }
            });
            await editProfile.save();
        }

        res.json(editProfile); // Ensure response is sent correctly
    } catch (err) {
        console.error("Error updating profile:", err); // Log the error for debugging
        res.status(500).send('Server Error'); // Ensure a clear response is sent for errors
    }
});

app.post('/follow/:userId', middleware, async (req, res) => {
    // console.log("Middleware user:", req.user); // Log middleware user
    // console.log("Params:", req.params); // Log params to check userId
  
    const currentUserId = req.user.id; // Assuming req.user.id is set by your middleware
    const targetUserId = req.params.userId;
  
    // console.log(`Current User ID: ${currentUserId}`);
    // console.log(`Target User ID: ${targetUserId}`);
  
    try {
      // Ensure a user cannot follow themselves
      if (currentUserId === targetUserId) {
        return res.status(400).json({ message: 'You cannot follow yourself' });
      }
  
      // Find the profile of the user to be followed
      let targetProfile = await EditProfile.findOne({ userId: targetUserId });
  
      if (!targetProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      // Initialize followers array if it's null or undefined
      if (!targetProfile.followers) {
        targetProfile.followers = [];
      }
  
      // Check if the current user has already followed the target user
      if (targetProfile.followers.includes(currentUserId)) {
        return res.status(400).json({ message: 'You have already followed this user' });
      }
  
      // Add the current user to the followers list
      targetProfile.followers.push(currentUserId);
      targetProfile.followersCount += 1; // Increment followers count
  
      // Save the updated profile
      await targetProfile.save();
  
      // Respond with the updated profile data and success message
      res.json({ 
        message: 'You have successfully followed this user',
        profile: targetProfile 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});


app.listen(5000, () => {
    console.log("Server is running .....");
});
