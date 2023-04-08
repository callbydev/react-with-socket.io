// 1
const { Server } = require("socket.io");

// 2
const io = new Server("5000", {
    cors: {
        origin: "http://localhost:3000",
    },
});

// 3
io.sockets.on("connection", (socket) => {
    // 4
    socket.on("message", (data) => {
        // 5
        socket.broadcast.emit("sMessage", data);
    });
    // 6
    socket.on("login", (data) => {
        socket.broadcast.emit("sLogin", data);
    });
    // 7
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});
