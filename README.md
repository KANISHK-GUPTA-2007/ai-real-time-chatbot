
# AI Real-Time Chatbot (Ollama + Socket.IO)

A real-time chatbot web app that runs locally using Ollama (no OpenAI API key required).

## Features

- Real-time chat UI in browser
- Streaming assistant responses
- Local model inference via Ollama
- Simple Node.js backend with Socket.IO

## Tech Stack

- Node.js
- Express
- Socket.IO
- Ollama

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm
- Ollama installed on your machine

## 1. Clone the Project

```bash
git clone https://github.com/KANISHK-GUPTA-2007/ai-real-time-chatbot.git
cd ai-real-time-chatbot
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment

Create a `.env` file in project root:

```env
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2
PORT=3000
```

You can also copy from template:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## 4. Start Ollama and Download Model

Start Ollama (if not already running), then pull model:

```bash
ollama pull llama3.2
```

Optional quick check:

```bash
ollama list
```

## 5. Run the Chatbot

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Open in browser:

`http://localhost:3000`

## Project Structure

```text
.
|-- public/
|   |-- app.js
|   |-- index.html
|   `-- styles.css
|-- server.js
|-- package.json
|-- .env.example
`-- README.md
```

## Troubleshooting

- `EADDRINUSE: address already in use :::3000`
  - Another app is using port 3000. Stop that process or change `PORT` in `.env`.

- `Could not connect to Ollama`
  - Ensure Ollama is running and `OLLAMA_BASE_URL` is correct (`http://127.0.0.1:11434`).

- `model not found`
  - Pull the model first: `ollama pull llama3.2`

- `ollama not recognized`
  - Install Ollama and restart terminal.

## Notes

- This project is local-first and does not require cloud API keys.
- Keep `.env` private (it is already gitignored).
