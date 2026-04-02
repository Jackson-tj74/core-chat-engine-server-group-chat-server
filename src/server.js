
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";


import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";


import { notFound, errorHandler } from "./middleware/errorMiddleware.js";


import chatSocket from "./sockets/chatSocket.js";


dotenv.config();
connectDB(); 

const app = express();


app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", 
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json()); 

app.get("/", (req, res) => {
  res.send("AgriYield Chat API is running...");
});

app.use("/api/auth", authRoutes);       
app.use("/api/messages", messageRoutes); 

app.use(notFound);
app.use(errorHandler);


const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000, 
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  },
});


chatSocket(io);

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`
  🚀 Server is flying on port ${PORT}
  🛠️  Mode: ${process.env.NODE_ENV || 'development'}
  📂 API: http://localhost:${PORT}/api
  `);
});