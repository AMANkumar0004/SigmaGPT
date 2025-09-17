import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected with Database!"))
  .catch((err) => console.error("Failed to connect with DB", err));

const allowedOrigins = [
  "https://sigma-gpt-wqqi.vercel.app",
  "http://localhost:5174",
];

// Apply JSON middleware first
app.use(express.json());

// Apply CORS middleware globally
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Incoming origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Explicitly handle OPTIONS preflight requests
app.options(
  "*",
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Define routes after middleware
app.use("/api", chatRoutes);

app.get("/", (req, res) => {
  res.send("API is working!");
});

export default app;
