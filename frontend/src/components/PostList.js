import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  TextareaAutosize,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Navbar from "./Navbar";
import "./Posts.css";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedMessage, setEditedMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `https://post-app-gray.vercel.app/api/message/posts`
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts", error);
      }
    };
    fetchPosts();
  }, []);

  // Logic for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

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
  const handleNextPage = () => {
    if (currentPage < Math.ceil(posts.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="posts-container">
        <Typography variant="h4" gutterBottom>
          All Posts
        </Typography>
        <Box display="flex" flexWrap="wrap" justifyContent="space-between">
          {currentPosts.map((post) => (
            <Box key={post._id} width={{ xs: "100%", sm: "48%", md: "30%" }} mb={3}>
              <Card className="post-item">
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
                        <div className="image-container">
                          <img
                            src={post.imageUrl}
                            alt={post.name}
                            className="post-image"
                          />
                        </div>
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
                      >
                        Delete
                      </Button>
                      {/* <div className="likes-container">
                        <FavoriteIcon className="like-icon" />
                        <Typography variant="body2">
                          {post.likes} Likes
                        </Typography>
                      </div> */}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
        {/* Pagination Controls */}
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            style={{ marginRight: "10px" }}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
          >
            Next
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default AllPosts;
