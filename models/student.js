const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const studentSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
  },
  instituteName: {
    type: "string",
    required: true,
  },
  instituteID: {
    type: "string",
    required: true,
    unique: true,
  },
  department: {
    type: "string",
    required: true,
  },
  degree: {
    type: "string",
    required: true,
  },
  rollNo: {
    type: "string",
    required: true,
  },
  classesJoined: {
    type: Array,
    default: [],
  },
  studentID: {
    type: "String",
    unique: true,
  },
});

studentSchema.plugin(uniqueValidator);

studentSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }
  const min = 100000;
  const max = 999999;
  const studentCode = Math.floor(Math.random() * (max - min + 1)) + min;
  const studentID = "S_" + studentCode.toString();

  const existingDocument = await this.constructor.findOne({ studentID });
  if (existingDocument) {
    return this.pre("save", next);
  }

  this.studentID = studentID;
  next();
});

module.exports = mongoose.model("Student", studentSchema);
