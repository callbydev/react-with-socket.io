const privateMsg = require("./privateMsg");
const groupMsg = require("./groupMsg");
const common = require("./common");

const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

common.commoninit(io);
groupMsg.groupMsginit(io);
privateMsg.privateMsginit(io);
