const http = require("http");
const sockjs = require("sockjs");

const sock = sockjs.createServer({
  sockjs_url: "http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js",
});

const clients = new Map();

sock.on("connection", function (conn) {
  let myId = "";
  conn.on("data", function (message) {
    const { data, type } = JSON.parse(message);
    switch (type) {
      case "id":
        myId = data;
        clients.set(data, conn);
        break;
      case "msg":
        clients.forEach((value, key, map) => {
          if (key !== myId) {
            value.write(data);
          }
        });
        break;
      default:
        break;
    }
  });
  conn.on("close", function () {
    delete clients[myId];
  });
});

const server = http.createServer();
sock.installHandlers(server, { prefix: "/sock" });
server.listen(9999, "0.0.0.0");
