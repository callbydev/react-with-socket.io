const io = require("socket.io")(5000, {
    cors: {
        origin: "http://localhost:3000",
    },
});

const userMap = new Map();

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
    setUserMap(socket.userId);
    console.log(userMap);
    io.sockets.emit("user-list", mapToArray(userMap));

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

function setStatus(socketId) {
    userMap.set(socketId, { ...userMap.get(socketId), status: false });
}

function setUserMap(userId) {
    userMap.set(userId, { userId: userId, status: true });
}
