const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 5000 });

wss.on("connection", (ws) => {
  const connectMsg = "새로운 사용자가 입장했습니다.";
  console.log(connectMsg);

  const broadCastHandler = (msg) => {
    wss.clients.forEach(function each(client, i) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  };

  broadCastHandler(connectMsg);

  ws.on("message", (data) => {
    console.log(`Client has sent us :${data}`);
    broadCastHandler(data);
  });

  ws.on("close", () => {
    console.log("client has disconnected");
  });
});
