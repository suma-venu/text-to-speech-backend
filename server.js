const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Text-to-Speech API is running",
  });
});


// Text-to-Speech API
app.post("/api/tts", (req, res) => {
  const { text, language, voice } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({
      error: "Text is required",
    });
  }

  console.log("TTS Request:");
  console.log("Text:", text);
  console.log("Language:", language);
  console.log("Voice:", voice);

  res.json({
    message: "TTS request received successfully",
    text,
    language,
    voice,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});