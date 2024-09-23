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
} from "@mui/material"; // Import Box instead of Grid
import Navbar from "./Navbar"; // Import the Navbar
import "./Posts.css";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedMessage, setEditedMessage] = useState("");
  const [editedImage, setEditedImage] = useState(null); // State to store the new image

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
    setEditedImage(null); // Reset image when editing starts
  };

  const handleUpdate = async (id) => {
    try {
      const formData = new FormData();
      formData.append("name", editedName);
      formData.append("message", editedMessage);
      if (editedImage) {
        formData.append("image", editedImage); // Attach the image file if present
      }

      await axios.put(
        `https://post-app-gray.vercel.app/api/message/posts/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the post locally without reloading
      setPosts(
        posts.map((post) =>
          post._id === id
            ? { ...post, name: editedName, message: editedMessage }
            : post
        )
      );
      setEditingPostId(null); // Exit edit mode after updating
    } catch (error) {
      console.error("Error updating post", error); // Log the error
    }
  };

  return (
    <div>
      <Navbar /> {/* Include the Navbar */}
      <div className="posts-container">
        <Typography variant="h4" gutterBottom>
          All Posts
        </Typography>
        <Box display="flex" flexWrap="wrap" justifyContent="space-between">
          {posts.map((post) => (
            <Box
              key={post._id}
              width={{ xs: "100%", sm: "48%", md: "30%" }}
              mb={3}
            >
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
                      {/* Add file input for image */}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditedImage(e.target.files[0])}
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
                    </div>
                  )}
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </div>
    </div>
  );
};

export default AllPosts;
