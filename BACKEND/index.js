require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

// Middleware
app.use(express.json());

// Enable CORS with specific origin
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this to your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Handle preflight requests (for methods like POST, PUT, DELETE)
app.options("*", cors());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use routes
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to My API</h1>");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
