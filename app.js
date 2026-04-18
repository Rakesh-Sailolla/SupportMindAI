import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import OpenAI from "openai";
import Thread from "./models/Thread.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
const port = process.env.PORT ||8000;

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// OpenRouter
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// Home
app.get("/", (req, res) => {
  res.render("index");
});

// Create new chat
app.post("/new-chat", async (req, res) => {
  const threadId = uuidv4();

  await Thread.create({
    threadId,
    messages: []
  });

  res.json({ threadId });
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  const { message, threadId } = req.body;

  let thread = await Thread.findOne({ threadId });

  if (!thread) {
    thread = await Thread.create({
      threadId,
      messages: []
    });
  }

  // Save user message
  thread.messages.push({ role: "user", content: message });

  // AI call
  const completion = await client.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: thread.messages,
  });

  const reply = completion.choices[0].message.content;

  // Save AI reply
  thread.messages.push({ role: "assistant", content: reply });

  await thread.save();

  res.json({ reply });
});

app.listen(port, () => {
  console.log("Server running on http://localhost:8000");
});