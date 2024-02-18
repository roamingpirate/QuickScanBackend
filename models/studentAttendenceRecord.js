const mongoose = require("mongoose");

const studentARSchema = new mongoose.Schema({
  classID: {
    type: "string",
  },
  studentID: {
    type: "string",
  },
  datesPresent: {
    type: "array",
    default: [],
  },
});

module.exports = mongoose.model("studentAR", studentARSchema);
