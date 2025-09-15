import express from "express";
import Thread from "../models/thread.js";
import getGeminiAPIResponse from "../utils/gemini.js";

const Router = express.Router();

// Test route
Router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "abc",
      title: "Testing New Thread2",
    });

    const response = await thread.save();
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});

// Get all threads
Router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// Get messages for a thread
Router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread.messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// Delete a thread
Router.delete("/thread/:threadId", async (req, res) => {
  console.log("Received request at /thread");

  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

// Chat route
Router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      // Create a new thread in DB
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistantReply = await getGeminiAPIResponse(message);
    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();

    res.json({ reply: assistantReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default Router;
