import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import http from "http";
import { Server, Socket } from "socket.io";

dotenv.config({ path: "./src/config/config.env" }); // Load env vars

// Global vars
let io: Server;
const onlineUsers: string[] = [];

// Create Express app
const app = express();

// Server setup
const PORT: number = parseInt(process.env.PORT || "8001");

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

// Socket.io setup
io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket: Socket) => {
  console.log("connected to socket", socket.id);
  io.to(socket.id).emit("reconnect", socket.id);

  socket.on("join", (userId: string) => {
    addUser(userId, socket.id);
  });

  socket.on("logout", () => {
    removeUser(socket.id);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("user disconnected", socket.id);
  });
});

function addUser(userId: string, socketId: string) {
  onlineUsers.push(userId);
  // Add your logic here for handling user addition
}

function removeUser(socketId: string) {
  const index = onlineUsers.findIndex((userId) => userId === socketId);
  if (index !== -1) {
    onlineUsers.splice(index, 1);
    // Add your logic here for handling user removal
  }
}
