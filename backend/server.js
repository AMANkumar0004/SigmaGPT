import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();

// Connect to DB when the function initializes (serverless warm start)
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected with Database!"))
  .catch((err) => console.error("Failed to connect with DB", err));

const allowedOrigins = [
  "https://sigma-gpt-wqqi.vercel.app",
  "http://localhost:5174",
];

app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
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

app.use("/api", chatRoutes);

app.get("/", (req, res) => {
  res.send("API is working!");
});

export default app;
