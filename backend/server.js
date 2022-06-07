const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const httpServer = createServer(app);

const users = new Set();

const io = new Server(httpServer, {
  cors: {
    // origin: "https://chat-roulette-drab.vercel.app/",
    origin: "http://localhost:3001",
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const findSomeone = () => {
  console.log(users);
  let newUsers = Array.from(users);
  if (newUsers.length < 2) {
    return null;
  }
  const index1 = Math.floor(Math.random() * newUsers.length);
  const user1 = newUsers[index1];

  console.log("user1", user1, index1);

  newUsers = newUsers.filter((user, i) => i !== index1);
  const index2 = Math.floor(Math.random() * newUsers.length);
  const user2 = newUsers[index2];
  console.log("user1", user1, index1);

  const connectedUsers = [user1, user2];

  return connectedUsers;
};

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("find-someone", (userId) => {
    users.add(userId);
    const connectedUsers = findSomeone();

    if (connectedUsers === null) {
      // io.to(connectedUsers[0]).emit("error", "no user found");
      // io.to(connectedUsers[1]).emit("error", "no user found");
      console.log("2 users not connected");
      return;
    }
    console.log(connectedUsers.length);

    console.log("connected users", connectedUsers);
    io.to(connectedUsers[0]).emit("make-call", connectedUsers[1]);
    io.to(connectedUsers[1]).emit("answer-call", connectedUsers[0]);
    users.delete(connectedUsers[0]);
    users.delete(connectedUsers[1]);
  });

  //   socket.on("callUser", (data) => {
  //     io.to(data.userToCall).emit("callUser", {
  //       signal: data.signalData,
  //       from: data.from,
  //       name: data.name,
  //     });
  //   });

  //   socket.on("answerCall", (data) => {
  //     io.to(data.to).emit("callAccepted"), data.signal;
  //   });
});

httpServer.listen(3000);
