require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
const MODEL = process.env.OLLAMA_MODEL || "llama3.2";

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("chat:message", async (payload) => {
    const userMessage = payload?.message?.trim();

    if (!userMessage) {
      return;
    }

    const messageId = Date.now().toString();
    socket.emit("chat:stream:start", { messageId });

    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are a concise, helpful chatbot. Keep answers clear and practical.",
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
          stream: true,
        }),
      });

      if (!response.ok || !response.body) {
        const details = await response.text();
        throw new Error(`Ollama request failed: ${response.status} ${details}`);
      }

      let emittedEnd = false;
      const decoder = new TextDecoder();
      let buffer = "";

      for await (const chunk of response.body) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) {
            continue;
          }

          const parsed = JSON.parse(trimmed);
          const delta = parsed?.message?.content;

          if (delta) {
            socket.emit("chat:stream:delta", {
              messageId,
              delta,
            });
          }

          if (parsed?.done) {
            socket.emit("chat:stream:end", { messageId });
            emittedEnd = true;
          }
        }
      }

      if (!emittedEnd) {
        socket.emit("chat:stream:end", { messageId });
      }
    } catch (error) {
      socket.emit("chat:error", {
        messageId,
        error: error?.message || "Failed to get AI response.",
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Using Ollama model "${MODEL}" via ${OLLAMA_BASE_URL}`);
});
