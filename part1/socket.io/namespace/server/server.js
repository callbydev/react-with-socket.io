const { Server } = require("socket.io");

const io = new Server("5000", {
  cors: {
    origin: "http://localhost:3000",
  },
});
// 1
io.of("/goods").on("connection", (socket) => {
  socket.on("shoes", (res) => {
    socket.join("shoes");
  });
  socket.on("pants", (res) => {
    socket.join("pants");
  });
});
// 2
io.of("/users").on("connection", (socket) => {
  socket.on("admin", (res) => {});
});
