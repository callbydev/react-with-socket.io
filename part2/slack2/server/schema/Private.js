const { Schema, model } = require("mongoose");

const msg = new Schema({
  _id: String,
  status: Boolean,
  userId: String,
  socketId: String,
});

const room = new Schema({
  _id: String,
});

module.exports = {
  privateMsg: model("Private-msg", msg),
  privateRoom: model("Private-room", room),
};
