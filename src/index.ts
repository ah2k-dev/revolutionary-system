import express,{ Application, Express } from 'express';
import dotenv from "dotenv";
import app from './app';
import connectDB from "./config/db";
import http from "http";
import {addUser, removeUser} from './functions/socketFunctions'
import { Server, Socket } from "socket.io";
dotenv.config({ path: "./src/config/config.env" }); // Load env vars

// Global vars
let io: Server;


// Server setup
const PORT: string = process.env.PORT

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

