const mongoose = require('mongoose');

const SocialMediaSchema = new mongoose.Schema({
    facebook: {
        type: String,
        default: ''
    },
    twitter: {
        type: String,
        default: ''
    },
    instagram: {
        type: String,
        default: ''
    }
});

const EditProfileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true // Assuming one edit profile per user ID
    },
    username: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
       required:true
    },
    about: {
        type: String,
        default: ''
    },
    socialMedia: {
        type: SocialMediaSchema,
        default: () => ({})
    },
    followers: {
        type: Number,
        default: 0
    },
    ratings: {
        type: Number,
        default: 0
    },
    recipeCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('EditProfile', EditProfileSchema);
