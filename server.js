const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { ElevenLabsClient } = require("@elevenlabs/elevenlabs-js");
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

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
app.post("/api/tts", async (req, res) => {
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

  try {
    const audio = await elevenlabs.textToSpeech.convert(voice, {
      text: text,
      modelId: "eleven_multilingual_v2",
    });

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "inline",
    });

    const chunks = [];

    for await (const chunk of audio) {
      chunks.push(chunk);
    }

    const audioBuffer = Buffer.concat(chunks);

    res.send(audioBuffer);
  } catch (error) {
    console.error("ElevenLabs TTS Error:", error);

    res.status(500).json({
      error: error.message || "Failed to generate speech",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});