import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  TextareaAutosize,
  Pagination,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Navbar from "./Navbar";
import "./Posts.css"; // Ensure you style this properly

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedMessage, setEditedMessage] = useState("");
  const [page, setPage] = useState(1); // Page state for pagination
  const [likes, setLikes] = useState({});

  const postsPerPage = 5; // Set posts per page limit

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `https://post-app-gray.vercel.app/api/message/posts`
        );
        setPosts(response.data);
        // Initialize likes for each post (assuming no likes in backend)
        const initialLikes = {};
        response.data.forEach((post) => (initialLikes[post._id] = 0));
        setLikes(initialLikes);
      } catch (error) {
        console.error("Error fetching posts", error);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://post-app-gray.vercel.app/api/message/posts/${id}`
      );
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setEditedName(post.name);
    setEditedMessage(post.message);
  };

  const handleUpdate = async (id) => {
    try {
      const updatedPost = { name: editedName, message: editedMessage };
      await axios.put(
        `https://post-app-gray.vercel.app/api/message/posts/${id}`,
        updatedPost
      );
      setPosts(
        posts.map((post) =>
          post._id === id ? { ...post, ...updatedPost } : post
        )
      );
      setEditingPostId(null);
    } catch (error) {
      console.error("Error updating post", error);
    }
  };

  // Handle pagination
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Handle likes
  const handleLike = (postId) => {
    setLikes({
      ...likes,
      [postId]: likes[postId] + 1,
    });
  };

  // Calculate posts to show based on page
  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div>
      <Navbar />
      <div className="posts-container">
        <Typography variant="h4" gutterBottom>
          All Posts
        </Typography>
        <ul className="posts-list">
          {currentPosts.map((post) => (
            <Card key={post._id} className="post-item">
              <CardContent>
                {editingPostId === post._id ? (
                  <div>
                    <TextField
                      fullWidth
                      label="Edit Name"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      margin="normal"
                      variant="outlined"
                    />
                    <TextareaAutosize
                      minRows={4}
                      placeholder="Edit Message"
                      value={editedMessage}
                      onChange={(e) => setEditedMessage(e.target.value)}
                      className="edit-textarea"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdate(post._id)}
                      style={{ marginRight: "10px" }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setEditingPostId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Typography variant="h5">{post.name}</Typography>
                    <Typography variant="body1">{post.message}</Typography>
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.name}
                        className="responsive-image"
                      />
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(post)}
                      style={{ marginRight: "10px" }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(post._id)}
                      style={{ marginRight: "10px" }}
                    >
                      Delete
                    </Button>
                    <IconButton
                      aria-label="like"
                      onClick={() => handleLike(post._id)}
                    >
                      <FavoriteIcon color="error" />
                    </IconButton>
                    <span>{likes[post._id]} Likes</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </ul>
        {/* Pagination component */}
        <Pagination
          count={Math.ceil(posts.length / postsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        />
      </div>
    </div>
  );
};

export default AllPosts;
