// 모듈 추출
const http = require("http");
const fs = require("fs").promises;
const url = require("url");

const users = [];

// 서버 생성
const server = http
    .createServer(async (req, res) => {
        const pathname = url.parse(req.url).pathname;
        const method = req.method;
        let data = null;

        if (method === "GET") {
            switch (pathname) {
                case "/":
                    res.writeHead(200, {
                        "Content-Type": "text/html; charset=utf-8",
                    });
                    data = await fs.readFile("./index.html");
                    res.end(data);
                    break;
                case "/users":
                    try {
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify(users));
                    } catch (err) {
                        console.error(err);
                    }
                    break;
                default:
                    res.writeHead(400, {
                        "Content-Type": "text/html; charset=utf-8",
                    });
                    data = await fs.readFile("./404.html");
                    res.end(data);
            }
        }
    })
    .listen(52273);

// 서버가 실행될 경우 이벤트 발생
server.on("listening", () => {
    console.log("52273 포트에서 서버가 실행중 입니다.");
});
// 서버에 에러가 발생할 경우 이벤트 발생
server.on("error", (err) => {
    console.log(err);
});
