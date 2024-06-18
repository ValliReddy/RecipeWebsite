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

app.listen(5000, () => {
    console.log("Server is running .....");
});
