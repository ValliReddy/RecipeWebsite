const mongoose = require('mongoose');

const NewsletterUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  }
  
});

module.exports = mongoose.model('NewsletterUserSchema', NewsletterUserSchema);
