const groupMap = new Map();
const groupUserListMap = new Map();
const groupMsgMap = new Map();

const groupMsg = (io) => {
  io.of("/group").use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      console.log("err");
      return next(new Error("invalid userId"));
    }
    socket.userId = userId;
    next();
  });

  io.of("/group").on("connection", (socket) => {
    setGroupUserListMap(socket.userId, socket.id);
    socket.emit("group-list", groupMap.get(socket.userId));
    socket.on("msgInit", (res) => {
      const { targetId } = res;
      let roomName = null;
      roomName = targetId.join(",");
      io.of("/group")
        .to(roomName)
        .emit("group-msg-init", { msg: groupMsgMap.get(roomName) || [] });
    });
    socket.on("groupUserListUpdate", async (res) => {
      const { socketId } = res;
      // const document = await Document.find()
      //   .where("_id")
      //   .in(socketId.split(","));
      socketId.split(",").forEach((v) => {
        // const document = await Document.findById(v);
        io.of("/group")
          .to(groupUserListMap.get(v).socketId)
          .emit("group-chat-req", {
            roomNumber: socketId,
            socketId: groupUserListMap.get(v).socketId,
            userId: socket.userId,
          });
      });
    });
    socket.on("groupMsg", (res) => {
      const { msg, toUserSocketId, toUserId, fromUserId } = res;
      setGroupeMsgMap(toUserSocketId, res);
      console.log(groupMap);
      socket.broadcast.in(toUserSocketId).emit("group-msg", {
        msg: msg,
        toUserId,
        fromUserId,
        toUserSocketId: toUserSocketId,
      });
    });
    socket.on("resGroupJoinRoom", (res) => {
      const { roomNumber, socketId } = res;
      socket.join(roomNumber);
      setGroupUserMap(socket.userId, roomNumber, roomNumber);

      io.of("/group")
        .to(socketId)
        .emit("group-list", groupMap.get(socket.userId));
    });
  });
};

function setGroupUserListMap(userId, socketId) {
  groupUserListMap.set(userId, {
    ...groupUserListMap.get(socketId),
    status: true,
    userId,
    socketId,
  });
}
function setGroupUserMap(loginUserId, userId, socketId) {
  groupMap.set(loginUserId, [
    ...(groupMap.get(loginUserId) || []),
    {
      status: true,
      userId,
      socketId,
      type: "group",
    },
  ]);
}

async function findOrCreateDocument(loginUserId, userId, socketId) {
  if (userId == null) return;

  if (document) return document;
  return await Document.create({
    _id: loginUserId,
    status: true,
    userId: userId,
    socketId: socketId,
    type: "group",
  });
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
}

module.exports.groupMsginit = groupMsg;
