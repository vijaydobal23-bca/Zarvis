import express from "express";

import authRoutes from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";

import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

import morgan from "morgan";
import cors from "cors";

const app = express();
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
   
app.use(cors({
  origin:["http://localhost:5173"],
  credentials: true,
  
}));

app.use(morgan("dev"));

app.use("/api/auth",authRoutes);
app.use("/api/chats",chatRouter);

export default app; 
 