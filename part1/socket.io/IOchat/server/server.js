// 1
const { Server } = require("socket.io");

// 2
const io = new Server("5000", {
 cors: {
   origin: "http://127.0.0.1:5500",
 },
});

// 3
io.sockets.on("connection", (socket) => {
 console.log("user connected");
 // 4
 socket.on("message", (data) => {
   // 5
   socket.emit("sMessage", data);
 });
 // 6
 socket.on("disconnect", () => {
   console.log("user disconnected");
 });
});