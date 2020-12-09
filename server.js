const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const {
  getCurrentUser,
  userLeave,
  getRoomUsers,
  joinUser,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static("public"));

// Run when client connects
io.on("connection", (socket) => {
  // Listen for code Shared
  socket.on("JOIN_ROOM", ({ username, room }) => {
    // Join user to the requested room
    const user = joinUser(socket.id, username, room);
    socket.join(user.room);

    // Notify joined user and other users in that room
    socket.emit("NOTIFICATION", "You have joined the room.");
    socket
      .to(user.room)
      .emit("NOTIFICATION", `${user.username} has joined the room.`);

    // Update users list of that room
    io.in(user.room).emit("USERS_LIST", getRoomUsers(user.room));

    // Handle sending chat messages
    socket.on("CHAT_MESSAGE_SEND", (message) => {
      socket.to(user.room).emit("CHAT_MESSAGE_RECEIVE", {
        username: user.username,
        message: message,
      });
    });

    socket.on("send", ({ shared_code, team_current }) => {
      const user = getCurrentUser(socket.id);
      socket.broadcast
        .to(user.room)
        .emit("receive", { shared_code, team_current });
      socket.broadcast
        .to(user.room)
        .emit("message", `${user.username} has shared the code!`);
      socket.emit("message", "You have shared your code!");
    });
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      socket.broadcast
        .to(user.room)
        .emit("message", `${user.username} has left the room!`);
      socket.emit("message", "You are offline! Please reload the page...");
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
