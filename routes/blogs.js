const express = require("express");
const blogrouter = express.Router();
const Blog = require("../models/Blog");
const upload = require('../middleware/upload');

// Upload blog
blogrouter.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { title, description, author, date, category, imageURL } = req.body;

    let imagePath = imageURL;
    if (req.file) {
      imagePath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const newBlog = new Blog({
      image: imagePath,
      title,
      description,
      author,
      date,
      category
    });

    await newBlog.save();
    res.status(200).json({ success: true, message: "Blog uploaded successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all blogs
blogrouter.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get blog by ID
blogrouter.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = blogrouter;
