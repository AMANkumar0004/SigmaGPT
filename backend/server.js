import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js"

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
const allowedOrigins = [
  "https://sigma-gpt-wqqi.vercel.app",
  "http://localhost:3000",
];

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

app.use("/api",chatRoutes);

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
  connectDB();
});


const connectDB = async()=>{

    try{
      await  mongoose.connect(process.env.MONGODB_URL)
      console.log("connected with Database !");
      
    }catch(err){
        console.log("failed to connect with the db",err);     
    }
}









// app.post("/test", async (req, res) => {

// });
