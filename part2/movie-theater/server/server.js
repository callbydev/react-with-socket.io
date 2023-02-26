const { Server } = require("socket.io");
const { seats } = require("./data");

const io = new Server("5000", {
  cors: {
    origin: "http://localhost:3000",
  },
});

let avatar = [...seats];
let antman = [...seats];
let cats = [...seats];

const setSeats = (roomNumber, seat) => {
  let temp = [];
  if (roomNumber === "1") {
    temp = [...avatar].map((s) => {
      return s.map((i) => {
        let temp = { ...i };
        if (i.seatNumber === seat) {
          temp = { ...i, status: 3 };
        }
        return temp;
      });
    });
    avatar = [...temp];
  } else if (roomNumber === "2") {
    temp = [...antman].map((s) => {
      return s.map((i) => {
        let temp = { ...i };
        if (i.seatNumber === seat) {
          temp = { ...i, status: 3 };
        }
        return temp;
      });
    });
    antman = [...temp];
  } else {
    temp = [...cats].map((s) => {
      return s.map((i) => {
        let temp = { ...i };
        if (i.seatNumber === seat) {
          temp = { ...i, status: 3 };
        }
        return temp;
      });
    });
    cats = [...temp];
  }
  return temp;
};
io.on("connection", (socket) => {
  socket.on("join", (movie) => {
    socket.join(movie);
    let tempSeat = [];
    if (movie === "1") {
      tempSeat = avatar;
    } else if (movie === "2") {
      tempSeat = antman;
    } else {
      tempSeat = cats;
    }
    io.sockets.in(movie).emit("sSeatMessage", tempSeat);
  });

  socket.on("addSeat", (seat) => {
    const myRooms = Array.from(socket.rooms);
    io.sockets.in(myRooms[1]).emit("sSeatMessage", setSeats(myRooms[1], seat));
  });

  socket.on("disconnect", () => {
    console.log("logout");
  });
});
