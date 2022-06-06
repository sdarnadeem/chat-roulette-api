const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001",
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("find-someone", (userId) => {});

  socket.on("disconnect", (reason) => {
    console.log("reason");
  });
});

httpServer.listen(3000);
