const http = require("http");

http
  .createServer((request, response) => {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end("<h1>Hello NodeJs</h1>");
  })
  .listen(5000, () => {
    console.log("Server is running");
  });
