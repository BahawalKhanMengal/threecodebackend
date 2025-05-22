const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  image: String, // This will be the path to uploaded file
  title: String,
  description: String,
  author: String,
  date: String,
  category: String,
});

module.exports = mongoose.model("Blog", blogSchema);
