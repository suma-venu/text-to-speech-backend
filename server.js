const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();


const { ElevenLabsClient } = require("@elevenlabs/elevenlabs-js");

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

const app = express();

const PORT = process.env.PORT || 5000;

const MAX_CHARACTERS = 5000;
const ttsLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: {
    error: "Too many TTS requests. Please try again later.",
  },
});

// Available voices
const voices = [
  {
    id: "CwhRBWXzGAHq8TQ4Fs17",
    name: "Male Voice",
    
    gender: "Male",
  },
  {
    id: "hpp4J3VqNfWAUOO0d1Us",
    name: "Female Voice",
    
    gender: "Female",
  },
];

// Supported languages
const supportedLanguages = [
  "en-US",
  "hi-IN",
  "kn-IN",
  "de-DE",
  "sv-SE",
  "es-ES",
  "fr-FR",
];

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Text-to-Speech API is running",
  });
});

// Get available voices
app.get("/api/voices", (req, res) => {
  res.json({
    voices,
  });
});

// Text-to-Speech API
app.post("/api/tts", ttsLimiter, async (req, res) => {
  const { text, language, voice } = req.body;

  // Validate text
  if (!text || !text.trim()) {
    return res.status(400).json({
      error: "Text is required",
    });
  }

  // Validate maximum characters
  if (text.length > MAX_CHARACTERS) {
    return res.status(400).json({
      error: `Text cannot exceed ${MAX_CHARACTERS} characters.`,
    });
  }

  // Validate language
  if (!supportedLanguages.includes(language)) {
    return res.status(400).json({
      error: "Unsupported language.",
    });
  }

  // Validate voice
  const selectedVoice = voices.find((item) => item.id === voice);

  if (!selectedVoice) {
    return res.status(400).json({
      error: "Invalid voice.",
    });
  }

  // Validate voice and language combination
  
  console.log("TTS Request:");
  console.log("Text:", text);
  console.log("Language:", language);
  console.log("Voice:", selectedVoice.name);

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