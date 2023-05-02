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
      let cc = await getRoomNumber2(userId, socket.userId);
      if (!cc) return;
      const msgList = await PrivateMsg.find({ roomNumber: cc._id }).exec();
      io.of("/private").to(cc._id).emit("private-msg-init", { msg: msgList });
    });
    socket.on("privateMsg", async (res) => {
      const { msg, toUserId, toUserSocketId } = res;
      let aa = await getRoomNumber2(toUserId, socket.userId);
      if (!aa) return;
      socket.broadcast.in(aa._id).emit("private-msg", {
        msg: msg,
        toUserId: toUserId,
        fromUserId: socket.userId,
      });
      await createMsgDocument(aa._id, res);
    });
    socket.on("reqJoinRoom", async (res) => {
      const { targetId, targetSocketId } = res;
      let bb = await getRoomNumber2(targetId, socket.userId);
      if (!bb) {
        bb = `${targetId}-${socket.userId}`;
        await findOrCreateRoomDocument(bb);
      } else {
        bb = bb._id;
      }
      console.log("reqJoinRoom", bb);
      socket.join(bb);
      io.of("/private")
        .to(targetSocketId)
        .emit("msg-alert", { roomNumber: bb });
    });
    socket.on("resJoinRoom", (res) => {
      socket.join(res);
    });
  });
};

async function getRoomNumber2(fromId, toId) {
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
