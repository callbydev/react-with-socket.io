const io = require("socket.io")(5000, {
    cors: {
        origin: "http://localhost:3000",
    },
});

const userMap = new Map();
const msgMap = new Map();

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

    socket.on("sendMsg", (res) => {
        const { msg, roomNumber, sender } = res;
        setMsgMap(roomNumber, res);
        io.sockets.to(roomNumber).emit("get-msg", { msg: msg, sender });
    });

    socket.on("disconnect", () => {
        setStatus(socket.userId);
        io.sockets.emit("user-list", mapToArray(userMap));
        console.log("disconnect...");
    });
});

function mapToArray(userMap) {
    return Array.from(userMap, ([key, value]) => ({
        ...value,
    }));
}

function setUserMap(userId, socketId) {
    userMap.set(userId, {
        ...userMap.get(socketId),
        status: true,
        userId,
        socketId,
    });
}

function setMsgMap(roomNumber, res) {
    msgMap.has(roomNumber)
        ? msgMap.set(roomNumber, [
              ...msgMap.get(roomNumber),
              {
                  msg: res.msg,
                  to: res.roomNumber,
                  from: res.sender,
              },
          ])
        : msgMap.set(roomNumber, [
              {
                  msg: res.msg,
                  to: res.roomNumber,
                  from: res.sender,
              },
          ]);
    console.log(msgMap);
}

function setStatus(userId) {
    userMap.set(userId, { ...userMap.get(userId), status: false });
}
