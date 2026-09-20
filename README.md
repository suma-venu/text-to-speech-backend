# Text-to-Speech Backend

Node.js and Express backend for the Text-to-Speech application.

The backend receives text, language, and voice information from the React frontend, communicates with the ElevenLabs Text-to-Speech API, and returns the generated audio.

## Features

- Text-to-Speech API
- Available voices API
- Text validation
- Maximum 5,000-character limit
- Language validation
- Voice validation
- Voice and language compatibility validation
- Rate limiting
- Error handling
- Secure API key management using environment variables
- CORS support

## Technology Stack

- Node.js
- Express.js
- ElevenLabs Text-to-Speech API
- dotenv
- express-rate-limit
- CORS

## Project Structure

```text
server/
├── server.js
├── package.json
├── package-lock.json
├── .env
└── .gitignore