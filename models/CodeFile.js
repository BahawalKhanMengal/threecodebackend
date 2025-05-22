// models/CodeFile.js
const mongoose = require("mongoose");

const codeFileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
  filename: { type: String, required: true },
  language: { type: String, required: true },
  content: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("CodeFile", codeFileSchema);
