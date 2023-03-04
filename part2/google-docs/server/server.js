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

io.on("connection", (socket) => {
  let _documentId = "";
  socket.on("join", async (documentId) => {
    _documentId = documentId;
    const document = await findOrCreateDocument(documentId);
    console.log(document.data, documentId);
    socket.join(documentId);
    socket.emit("initDocument", document.data);

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(_documentId, { data });
      socket.broadcast.in(_documentId).emit("receive-changes", data);
    });
  });

  // socket.on("send-changes", (delta) => {
  //   console.log(_documentId);
  //   socket.broadcast.to(_documentId).emit("receive-changes", delta);
  // });

  socket.on("disconnect", () => {
    console.log("disconnect...");
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
}
