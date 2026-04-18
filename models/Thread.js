import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: String,
  content: String,
});

const ThreadSchema = new mongoose.Schema({
  threadId: String,
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Thread", ThreadSchema);