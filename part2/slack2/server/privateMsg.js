const { PrivateRoom, PrivateMsg } = require("./schema/Private");

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
    socket.on("msgInit", async (res) => {
      const { targetId } = res;
      const userId = targetId[0];
      const privateRoom = await getRoomNumber(userId, socket.userId);
      if (!privateRoom) return;
      const msgList = await PrivateMsg.find({ roomNumber: privateRoom._id }).exec();
      io.of("/private").to(privateRoom._id).emit("private-msg-init", { msg: msgList });
    });
    socket.on("privateMsg", async (res) => {
      const { msg, toUserId } = res;
      const privateRoom = await getRoomNumber(toUserId, socket.userId);
      if (!privateRoom) return;
      socket.broadcast.in(privateRoom._id).emit("private-msg", {
        msg: msg,
        toUserId: toUserId,
        fromUserId: socket.userId,
      });
      await createMsgDocument(privateRoom._id, res);
    });
    socket.on("reqJoinRoom", async (res) => {
      const { targetId, targetSocketId } = res;
      let privateRoom = await getRoomNumber(targetId, socket.userId);
      if (!privateRoom) {
        privateRoom = `${targetId}-${socket.userId}`;
        await findOrCreateRoomDocument(bb);
      } else {
        privateRoom = privateRoom._id;
      }
      socket.join(privateRoom);
      io.of("/private")
        .to(targetSocketId)
        .emit("msg-alert", { roomNumber: privateRoom });
    });
    socket.on("resJoinRoom", (res) => {
      socket.join(res);
    });
  });
};

async function getRoomNumber(fromId, toId) {
  return (
    (await PrivateRoom.findById(`${fromId}-${toId}`)) ||
    (await PrivateRoom.findById(`${toId}-${fromId}`))
  );
}

async function findOrCreateRoomDocument(room) {
  if (room == null) return;

  const document = await PrivateRoom.findById(room);
  if (document) return document;
  return await PrivateRoom.create({
    _id: room,
  });
}

async function createMsgDocument(roomNumber, res) {
  if (roomNumber == null) return;

  return await PrivateMsg.create({
    roomNumber: roomNumber,
    msg: res.msg,
    toUserId: res.toUserId,
    fromUserId: res.fromUserId,
  });
}

module.exports.privateMsginit = privateMsg;
