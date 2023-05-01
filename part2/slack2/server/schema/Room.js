const { Schema, model } = require("mongoose");

const room = new Schema({
  _id: String,
});

module.exports = model("Room", room);
