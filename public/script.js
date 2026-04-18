let threadId = null;

// Create new chat
async function newChat() {
  const res = await fetch("/new-chat", { method: "POST" });
  const data = await res.json();
  threadId = data.threadId;

  document.getElementById("chat").innerHTML = "";
}

// Send message
async function send() {
  const input = document.getElementById("msg");
  const message = input.value;

  if (!threadId) await newChat();

  const res = await fetch("/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ message, threadId })
  });

  const data = await res.json();

  const chat = document.getElementById("chat");

  chat.innerHTML += `<p><b>You:</b> ${message}</p>`;
  chat.innerHTML += `<p><b>AI:</b> ${data.reply}</p>`;

  input.value = "";
}