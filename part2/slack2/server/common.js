const mongoose = require("mongoose");
const Document = require("./schema/User");

const uri =
  "mongodb+srv://slack:1111@cluster0.g4q1ntc.mongodb.net/?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

const common = (io) => {
  io.use(async (socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      console.log("err");
      return next(new Error("invalid userId"));
    }
    socket.userId = userId;
    await findOrCreateDocument(socket.userId, socket.id);
    next();
  });

  io.on("connection", async (socket) => {
    io.sockets.emit("user-list", await Document.find());

    socket.on("disconnect", async () => {
      await Document.findOneAndUpdate(
        { _id: socket.userId },
        { status: false }
      );
      io.sockets.emit("user-list", await Document.find());
      console.log("disconnect...");
    });
  });
};


// function setStatus(userId) {
//   userMap.set(userId, { ...userMap.get(userId), status: false });
// }

async function findOrCreateDocument(userId, socketId) {
  if (userId == null) return;

  const document = await Document.findOneAndUpdate(
    { _id: userId },
    { status: true }
  );
  if (document) return document;
  return await Document.create({
    _id: userId,
    status: true,
    userId: userId,
    socketId: socketId,
  });
}

module.exports.commoninit = common;
