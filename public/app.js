const socket = io();

const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const submitBtn = form.querySelector("button");

const assistantMessages = new Map();

function appendMessage(text, role) {
  const el = document.createElement("div");
  el.className = `message ${role}`;
  el.textContent = text;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
  return el;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message) return;

  appendMessage(message, "user");
  input.value = "";
  submitBtn.disabled = true;

  socket.emit("chat:message", { message });
});

socket.on("chat:stream:start", ({ messageId }) => {
  const el = appendMessage("", "assistant");
  assistantMessages.set(messageId, el);
});

socket.on("chat:stream:delta", ({ messageId, delta }) => {
  const el = assistantMessages.get(messageId);
  if (!el) return;
  el.textContent += delta;
  chat.scrollTop = chat.scrollHeight;
});

socket.on("chat:stream:end", ({ messageId }) => {
  assistantMessages.delete(messageId);
  submitBtn.disabled = false;
  input.focus();
});

socket.on("chat:error", ({ messageId, error }) => {
  const el = assistantMessages.get(messageId);
  if (el) {
    el.textContent = `Error: ${error}`;
    assistantMessages.delete(messageId);
  } else {
    appendMessage(`Error: ${error}`, "assistant");
  }

  submitBtn.disabled = false;
  input.focus();
});
