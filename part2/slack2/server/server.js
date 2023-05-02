const privateMsg = require("./privateMsg");
const groupMsg = require("./groupMsg");
const common = require("./common");

const mongoose = require("mongoose");

const uri =
  "mongodb+srv://slack:1111@cluster0.g4q1ntc.mongodb.net/?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

common.commoninit(io);
groupMsg.groupMsginit(io);
privateMsg.privateMsginit(io);
