const { Server } = require("socket.io");
const { posts } = require("./data");
const io = new Server("5000", {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addNewUser = (username, socketId) => {
  !users.some((user) => user.username === username) &&
    users.unshift({
      ...posts[Math.floor(Math.random() * 5)],
      username,
      socketId,
    });
};

const getUser = (username) => {
  return users.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
    io.sockets.emit("user-list", JSON.stringify(users));
  });

  socket.on("sendNotification", ({ senderName, receiverName, type }) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getNotification", {
      senderName,
      type,
    });
  });

  socket.on("disconnect", () => {
    console.log("logout");
  });
});
