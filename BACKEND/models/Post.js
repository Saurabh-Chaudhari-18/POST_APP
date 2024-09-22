const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false, // Image is optional
  },
});

module.exports = mongoose.model('Post', postSchema);
