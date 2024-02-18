const mongoose = require("mongoose");

const classARSchema = new mongoose.Schema({
  classID: {
    type: "string",
  },
  date: {
    type: "Date",
  },
  students: {
    type: "array",
    default: [],
  },
});

module.exports = mongoose.model("ClassAR", classARSchema);
