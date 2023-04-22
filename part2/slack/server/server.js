const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const rooms = [];
const userMap = new Map();
const privateMsgMap = new Map();

io.use((socket, next) => {
  const userId = socket.handshake.auth.userId;
  if (!userId) {
    console.log("err");
    return next(new Error("invalid userId"));
  }
  socket.userId = userId;
  next();
});

io.on("connection", (socket) => {
  setUserMap(socket.userId, socket.id);
  io.sockets.emit("user-list", mapToArray(userMap));

  socket.on("privateMsg", (res) => {
    const { msg, toUserId } = res;
    let privateRoom = getRoomNumber(toUserId, socket.userId);
    if (!privateRoom) {
      privateRoom = `${toUserId}-${socket.userId}`;
      rooms.push(privateRoom);
      socket.join(privateRoom);
    }
    setPrivateMsgMap(privateRoom, res);
    socket.broadcast.in(privateRoom).emit("private-msg", {
      msg: msg,
      toUserId: toUserId,
      fromUserId: socket.userId,
    });
  });
  socket.on("msgInit", (res) => {
    const { userId } = res;
    const roomName = getRoomNumber(userId, socket.userId);
    io.sockets.emit("msg-init", { msg: privateMsgMap.get(roomName) || [] });
  });

  socket.on("disconnect", () => {
    setStatus(socket.userId);
    io.sockets.emit("user-list", mapToArray(userMap));
    console.log("disconnect...");
  });
});

function mapToArray(userMap) {
  return userMap
    ? Array.from(userMap, ([key, value]) => ({
        ...value,
      }))
    : [];
}

function getRoomNumber(fromId, toId) {
  const _myRooms = rooms;
  if (_myRooms.includes(`${fromId}-${toId}`)) {
    return `${fromId}-${toId}`;
  }
  if (_myRooms.includes(`${toId}-${fromId}`)) {
    return `${toId}-${fromId}`;
  }
  return null;
}
function setUserMap(userId, socketId) {
  userMap.set(userId, {
    ...userMap.get(socketId),
    status: true,
    userId,
    socketId,
  });
}

function setPrivateMsgMap(roomNumber, res) {
  privateMsgMap.has(roomNumber)
    ? privateMsgMap.set(roomNumber, [
        ...privateMsgMap.get(roomNumber),
        {
          msg: res.msg,
          to: res.toUserId,
        },
      ])
    : privateMsgMap.set(roomNumber, [
        {
          msg: res.msg,
          to: res.toUserId,
        },
      ]);
  console.log(privateMsgMap);
}

function setStatus(userId) {
  userMap.set(userId, { ...userMap.get(userId), status: false });
}
