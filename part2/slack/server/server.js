const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const rooms = [];
const userMap = new Map();
const personalUserMap = new Map();
const privateMsgMap = new Map();
const groupMsgMap = new Map();

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
  // setPersonalUserMap(socket.userId, socket.userId, socket.id);
  io.sockets.emit("user-list", mapToArray(userMap));

  //setPersonalMap(socket.userId, mapToArray(userMap));

  console.log(personalUserMap);
  socket.on("userListUpdate", (res) => {
    const { socketId } = res;
    socketId.split(",").forEach((v) => {
      io.sockets
        .to(userMap.get(v).socketId)
        .emit("group-chat-req", { roomNumber: socketId });
    });
  });
  socket.on("groupMsg", (res) => {
    const { msg, toUserSocketId, toUserId, fromUserId } = res;
    setGroupeMsgMap(toUserSocketId, res);
    socket.broadcast.in(toUserSocketId).emit("group-msg", {
      msg: msg,
      toUserId,
      fromUserId,
      toUserSocketId: toUserSocketId,
    });
  });

  socket.on("privateMsg", (res) => {
    const { msg, toUserId, toUserSocketId } = res;
    let privateRoom = getRoomNumber(toUserId, socket.userId);
    if (!privateRoom) {
      privateRoom = `${toUserId}-${socket.userId}`;
      rooms.push(privateRoom);
      // socket.join(privateRoom);
    }
    setPrivateMsgMap(privateRoom, res);
    socket.broadcast.in(privateRoom).emit("private-msg", {
      msg: msg,
      toUserId: toUserId,
      fromUserId: socket.userId,
    });
  });
  socket.on("resGroupJoinRoom", (res) => {
    socket.join(res);
    setGroupUserMap(res, res);
    io.sockets.to(res).emit("user-list", mapToArray(userMap));
  });
  socket.on("reqJoinRoom", (res) => {
    const { targetId, targetSocketId } = res;
    let roomName = getRoomNumber(targetId, socket.userId);
    if (!roomName) {
      roomName = `${targetId}-${socket.userId}`;
    }
    io.sockets.to(targetSocketId).emit("msg-alert", { roomNumber: roomName });
  });
  socket.on("resJoinRoom", (res) => {
    socket.join(res);
  });
  socket.on("msgInit", (res) => {
    const { targetId } = res;
    let roomName = null;
    if (targetId.length === 1) {
      const userId = targetId[0];
      roomName = getRoomNumber(userId, socket.userId);
      if (!roomName) {
        roomName = `${userId}-${socket.userId}`;
      }
      io.sockets
        .to(roomName)
        .emit("msg-init", { msg: privateMsgMap.get(roomName) || [] });
    } else if (targetId.length > 1) {
      roomName = targetId.join(",");
      io.sockets
        .to(roomName)
        .emit("msg-init", { msg: groupMsgMap.get(roomName) || [] });
    }
    console.log(roomName);
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
function setGroupUserMap(userId, socketId) {
  userMap.set(userId, {
    ...userMap.get(socketId),
    status: true,
    userId,
    socketId,
    type: "group",
  });
}

function setPrivateMsgMap(roomNumber, res) {
  privateMsgMap.has(roomNumber)
    ? privateMsgMap.set(roomNumber, [
        ...privateMsgMap.get(roomNumber),
        {
          msg: res.msg,
          toUserId: res.toUserId,
          fromUserId: res.fromUserId,
        },
      ])
    : privateMsgMap.set(roomNumber, [
        {
          msg: res.msg,
          toUserId: res.toUserId,
          fromUserId: res.fromUserId,
        },
      ]);
  console.log(privateMsgMap);
}
function setGroupeMsgMap(roomNumber, res) {
  groupMsgMap.has(roomNumber)
    ? groupMsgMap.set(roomNumber, [
        ...groupMsgMap.get(roomNumber),
        {
          msg: res.msg,
          toUserId: res.toUserId,
          fromUserId: res.fromUserId,
        },
      ])
    : groupMsgMap.set(roomNumber, [
        {
          msg: res.msg,
          toUserId: res.toUserId,
          fromUserId: res.fromUserId,
        },
      ]);
  console.log(groupMsgMap);
}
function setStatus(userId) {
  userMap.set(userId, { ...userMap.get(userId), status: false });
}
function setPersonalUserMap(userId, addedUserId, addedUserSocketId) {
  const temp = personalUserMap.get(userId) || [];
  personalUserMap.set(userId, [
    ...temp,
    {
      status: true,
      userId: addedUserId,
      socketId: addedUserSocketId,
    },
  ]);
}
function setPersonalMap(userId, userlist) {
  const temp = personalUserMap.get(userId) || [];
  personalUserMap.set(userId, [...temp, ...userlist]);
}
