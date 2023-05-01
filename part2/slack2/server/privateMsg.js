
const rooms = [];
const privateMsgMap = new Map();

const privateMsg = (io) => {

  io.of("/private").use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      console.log("err");
      return next(new Error("invalid userId"));
    }
    socket.userId = userId;
    next();
  });

  io.of("/private").on("connection", (socket) => {
    socket.on("msgInit", (res) => {
      const { targetId } = res;
      let roomName = null;
      const userId = targetId[0];
      roomName = getRoomNumber(userId, socket.userId);
      if (!roomName) {
        roomName = `${userId}-${socket.userId}`;
      }
      io.of("/private")
        .to(roomName)
        .emit("private-msg-init", { msg: privateMsgMap.get(roomName) || [] });
    });
    socket.on("privateMsg", (res) => {
      const { msg, toUserId, toUserSocketId } = res;
      let privateRoom = getRoomNumber(toUserId, socket.userId);
      if (!privateRoom) {
        privateRoom = `${toUserId}-${socket.userId}`;
        rooms.push(privateRoom);
      }
      setPrivateMsgMap(privateRoom, res);
      socket.broadcast.in(privateRoom).emit("private-msg", {
        msg: msg,
        toUserId: toUserId,
        fromUserId: socket.userId,
      });
    });
    socket.on("reqJoinRoom", (res) => {
      const { targetId, targetSocketId } = res;
      let roomName = getRoomNumber(targetId, socket.userId);
      console.log(roomName);
      if (!roomName) {
        roomName = `${targetId}-${socket.userId}`;
      }
      socket.join(roomName);
      io.of("/private")
        .to(targetSocketId)
        .emit("msg-alert", { roomNumber: roomName });
    });
    socket.on("resJoinRoom", (res) => {
      socket.join(res);
    });
  });

};

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
}

module.exports.privateMsginit = privateMsg;
