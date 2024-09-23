import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Navbar from "./Navbar";
import "../components/PostForm.css";

const PostForm = () => {
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      message: "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      message: Yup.string().required("Message is required"),
      image: Yup.mixed()
        .required("An image is required")
        .test("fileType", "Unsupported Format", (value) =>
          value
            ? ["image/jpeg", "image/png", "image/gif"].includes(value.type)
            : false
        ),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("message", values.message);
      formData.append("image", values.image);

      try {
        await axios.post(`https://post-app-gray.vercel.app/api/message/create`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Post created successfully!");
        formik.resetForm(); // Reset form after submission
      } catch (error) {
        console.error("Error creating post", error);
        setError("Failed to create post");
      }
    },
  });

  return (
    <div>
      <Navbar />
      <div className="form-container">
        <Card className="post-form-card">
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              Create a New Post
            </Typography>
            <form onSubmit={formik.handleSubmit} className="form-content">
              {error && (
                <Typography
                  variant="body2"
                  color="error"
                  className="error-message"
                >
                  {error}
                </Typography>
              )}
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                margin="normal"
                variant="outlined"
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <TextField
                fullWidth
                label="Message"
                name="message"
                value={formik.values.message}
                onChange={formik.handleChange}
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
                error={formik.touched.message && Boolean(formik.errors.message)}
                helperText={formik.touched.message && formik.errors.message}
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(event) => {
                  formik.setFieldValue("image", event.currentTarget.files[0]);
                }}
                className="file-input"
              />
              {formik.touched.image && formik.errors.image && (
                <div className="error-message">{formik.errors.image}</div>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="submit-button"
              >
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostForm;
