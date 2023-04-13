const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const userMap = new Map();

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
      console.log("err");
      return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  

  socket.on("disconnect", () => {
    console.log("disconnect...");
  });
});

function setUserMap(documentId, myId) {
  const tempUserList = userMap.get(documentId);
  if (!tempUserList) {
    userMap.set(documentId, [myId]);
  } else {
    userMap.set(documentId, [...tempUserList, myId]);
  }
}

