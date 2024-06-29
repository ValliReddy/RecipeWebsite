const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Ensure you have jwt installed
const nodemailer = require('nodemailer'); // Ensure you have nodemailer installed
const crypto = require('crypto');
const cors = require('cors');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const middleware = require('./middleware');
require('dotenv').config();
const Newsletter=require('./models/NewsletterSchema');


const RegisterUser = require('./models/RegisterUser');
const Comment = require('./models/Comment');
const Recipe = require('./models/RecipeSchema');
const EditProfile = require('./models/EditSchema');

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // debug: true, // Enable debug output
    // logger: true // Log the actual delivery details to console
});

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
            return res.status(400).send('User Already Exists');
        }
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser = new RegisterUser({
            username,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword // This field should be removed in a real application
        });
        await newUser.save();
        res.status(200).send('Registered Successfully');
    } catch (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        let exist = await RegisterUser.findOne({ email: email });
        if (!exist) {
            return res.status(400).send('User not found');
        }
        const isMatch = await bcrypt.compare(password, exist.password);
        if (!isMatch) {
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
        const comments = await Comment.find({ recipe: id })
            .populate('user', 'username')
            .populate('replies.user', 'username'); // Populate user field in replies
        res.json(comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/comments', middleware, async (req, res) => {
    try {
        const { recipe, content, rating } = req.body;
        const newComment = new Comment({
            recipe,
            user: req.user.id,
            content,
            rating
        });
        await newComment.save();

        res.status(201).json({ commentId: newComment._id, message: 'Comment added successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/comments/:id/replies', middleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const reply = {
            user: req.user.id,
            content
        };

        comment.replies.push(reply);
        await comment.save();

        res.status(201).json({ message: 'Reply added successfully', replyId: reply._id });
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

app.put('/recipes/:recipeID', upload.single('recipeImage'), async (req, res) => {
    try {
      const { author, recipeName, ingredients, instructions } = req.body;
      const imagePath = req.file ? req.file.path : null;
  
      let recipe = await Recipe.findById(req.params.recipeID);
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
      recipe.author = author;
      recipe.recipeName = recipeName;
      recipe.ingredients = ingredients;
      recipe.instructions = instructions;
      recipe.imagePath = imagePath || recipe.imagePath; // Preserve existing image if not updated
  
      await recipe.save();
      res.json({ message: 'Recipe updated successfully', recipe });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
  // DELETE route to delete a recipe by ID
  app.delete('/recipes/:recipeID', async (req, res) => {
    try {
      const recipe = await Recipe.findByIdAndDelete(req.params.recipeID);
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      res.json({ message: 'Recipe deleted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });



  app.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        let user = await RegisterUser.findOne({ email: email });
        if (!user) {
            return res.status(400).send('User not found');
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = Date.now() + 600000; // 1 hour expiry

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        let mailOptions = {
            from: process.env.EMAIL_USER, // replace with your email
            to: email,
            subject: 'Password Reset OTP',
            html: `
                    <div style="text-align: center;">
                        <img style="max-width: 100%; height: auto;" src="https://img.icons8.com/clouds/100/food-bar.png" alt="Logo"/>
                    </div>
                    <p>We received a request to reset your password for your FavorFusion account.</p>
                    <p>Your OTP Code: <strong>${otp}</strong></p>
                    <p>This code is valid for the next 10 minutes.</p>
                    <p>If you did not request this password reset, please ignore this email or contact our support team immediately.</p>
                    <p>Stay safe!</p>
                    <p>Best regards,<br>The FavorFusion Team</p>
                `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send('Error sending email');
            } else {
                res.status(200).send('OTP sent to email');
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error');
    }
});

app.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword, confirmNewPassword } = req.body;

        let user = await RegisterUser.findOne({ email: email });
        if (!user) {
            return res.status(400).send('User not found');
        }
        if (user.otp !== otp || Date.now() > user.otpExpiry) {
            return res.status(400).send('Invalid or expired OTP');
        }
        if (newPassword !== confirmNewPassword) {
            return res.status(400).send('Passwords do not match');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.otp = null; // Clear OTP
        user.otpExpiry = null; // Clear OTP expiry
        await user.save();

        res.status(200).send('Password reset successfully');
    } catch (err) {
        console.log(err);
        return res.status(500).send('Server Error');
    }
});


app.post('/:recipeId/rate', async (req, res) => {
    const { rating } = req.body;
    const { recipeId } = req.params;
    // console.log(rating)

    try {
        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Update ratings and save
        recipe.ratings = rating;
        await recipe.save();
        // console.log(recipe)

        res.status(200).json({ message: 'Rating updated successfully' });
    } catch (error) {
        console.error('Error updating rating:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



app.post('/editprofile/update-ratings', async (req, res) => {
    const { userID, newRating } = req.body;
  
    try {
      // Find the EditProfile document for the given userID
      let userProfile = await EditProfile.findOne({ userId: userID });
  
      if (!userProfile) {
        return res.status(404).json({ error: 'User profile not found' });
      }
  
      // Update the ratings field
      userProfile.ratings = newRating; // Assuming newRating is the updated average rating
  
      // Save updated profile
      await userProfile.save();
  
      res.status(200).json({ message: 'Ratings updated successfully' });
    } catch (error) {
      console.error('Error updating ratings:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/newsletter-signup', async (req, res) => {
    const { name, email } = req.body;
  
    try {
      const newUser = new Newsletter({ username: name, email: email });
      await newUser.save();
      res.status(201).json({ message: 'Signed up successfully!' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

app.listen(5000, () => {
    console.log("Server is running .....");
});
