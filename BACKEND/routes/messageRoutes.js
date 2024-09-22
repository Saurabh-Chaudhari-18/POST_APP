const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const upload = require('../config/cloudinary');

// Create a new post with image
router.post('/create', upload.single('image'), async (req, res) => {
  try {
    const newPost = new Post({
      name: req.body.name,
      message: req.body.message,
      imageUrl: req.file ? req.file.path : null, // Cloudinary URL if image exists
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error, could not create post' });
  }
});

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error, could not fetch posts' });
  }
});

// Delete a post
router.delete('/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error, could not delete post' });
  }
});

module.exports = router;
