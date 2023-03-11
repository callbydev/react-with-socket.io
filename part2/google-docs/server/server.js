const mongoose = require("mongoose");
const Document = require("./Schema");

const uri =
  "mongodb+srv://google-doc:jhP%40ssw0rd@cluster0.lmbojbe.mongodb.net/?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: "1",
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const defaultValue = "";

const userMap = new Map();

console.log(userMap);

io.on("connection", (socket) => {
  let _documentId = "";
  socket.on("join", async (documentId) => {
    _documentId = documentId;
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("initDocument", {
      _document: document.data,
      userList: userMap.get(documentId) || [],
    });
    const myId = Array.from(socket.rooms)[0];
    setUserMap(_documentId, myId);
    socket.broadcast.to(_documentId).emit("newUser", myId);
  });

  socket.on("save-document", async (data) => {
    await Document.findByIdAndUpdate(_documentId, { data });
  });

  socket.on("send-changes", (delta) => {
    socket.broadcast.to(_documentId).emit("receive-changes", delta);
  });

  socket.on("cursor-changes", (range) => {
    const myRooms = Array.from(socket.rooms);
    socket.broadcast
      .to(_documentId)
      .emit("receive-cursor", { range: range, id: myRooms[0] });
  });

  socket.on("disconnect", () => {
    console.log("disconnect...");
  });
});

function setUserMap(documentId, myId) {
  const tempUserList = userMap.get(documentId);
  if (!tempUserList) {
    userMap.set(documentId, [myId]);
  } else {
    userMap.set(documentId, [...tempUserList, myId]);
  }
}

async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
}
