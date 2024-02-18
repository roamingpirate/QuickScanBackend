const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
  instituteName: {
    type: "string",
    required: true,
  },
  deviceId: {
    type: "string",
    required: true,
  },
  accountType: {
    type: "string",
    required: true,   
  },
});

module.exports = mongoose.model("User", userSchema);
