const privateMsgMap = new Map();

const mongoose = require("mongoose");
// const privateRoom = require("./schema/Room");
const { privateRoom } = require("./schema/Private");

const uri =
  "mongodb+srv://slack:1111@cluster0.g4q1ntc.mongodb.net/?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

const privateMsg = (io) => {
  console.log(privateRoom);
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
      console.log("msgInit", cc._id);
      io.of("/private")
        .to(cc._id)
        .emit("private-msg-init", { msg: privateMsgMap.get(cc._id) || [] });
    });
    socket.on("privateMsg", async (res) => {
      const { msg, toUserId, toUserSocketId } = res;
      let aa = await getRoomNumber2(toUserId, socket.userId);
      if (!aa) return;
      setPrivateMsgMap(aa._id, res);
      socket.broadcast.in(aa._id).emit("private-msg", {
        msg: msg,
        toUserId: toUserId,
        fromUserId: socket.userId,
      });
    });
    socket.on("reqJoinRoom", async (res) => {
      const { targetId, targetSocketId } = res;
      let bb = await getRoomNumber2(targetId, socket.userId);
      if (!bb) {
        bb = `${targetId}-${socket.userId}`;
        await findOrCreateDocument(bb);
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
    (await privateRoom.findById(`${fromId}-${toId}`)) ||
    (await privateRoom.findById(`${toId}-${fromId}`))
  );
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

async function findOrCreateDocument(room) {
  if (room == null) return;

  const document = await privateRoom.findById(room);
  if (document) return document;
  return await privateRoom.create({
    _id: room,
  });
}

module.exports.privateMsginit = privateMsg;
