const express = require('express');
const Filerouter = express.Router();
const CodeFile = require('../models/CodeFile'); // Adjust path as needed
const authMiddleware = require('./authMiddleware');


// Save or update code file
Filerouter.post('/save-code', authMiddleware, async (req, res) => {
  const { language, filename, content } = req.body;
  const userId = req.user.id; // ✅ Extract userId from authenticated token

  console.log("Incoming save request:", { userId, language, filename, content });

  try {
    let codeFile = await CodeFile.findOne({ userId, language, filename });

    if (codeFile) {
      codeFile.content = content;
      await codeFile.save();
      console.log("Updated existing file");
    } else {
      codeFile = new CodeFile({ userId, language, filename, content });
      await codeFile.save();
      console.log("Saved new file");
    }

    res.status(200).json({ success: true, message: 'Code saved successfully' });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ success: false, message: 'Error saving code', error: err });
  }
});

// Get all files for a specific user (authenticated)
Filerouter.get('/get-files', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const files = await CodeFile.find({ userId }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, files });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ success: false, message: 'Error fetching files', error: err });
  }
});
// Get code content for a specific file by filename and language
Filerouter.get('/get-code', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { filename, language } = req.query;

  if (!filename || !language) {
    return res.status(400).json({ success: false, message: "Filename and language are required" });
  }

  try {
    const file = await CodeFile.findOne({ userId, filename, language });

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    return res.status(200).json({ success: true, content: file.content });
  } catch (err) {
    console.error("Get-code error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err });
  }
});

module.exports = Filerouter;