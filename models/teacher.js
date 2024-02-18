const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const teacherSchema = new mongoose.Schema({
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
  classesCreated: {
    type: Array,
    default: [],
  },
  teacherID: {
    type: "String",
    unique: true,
  },
});

teacherSchema.plugin(uniqueValidator);

teacherSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }
  const min = 100000;
  const max = 999999;
  const teacherCode = Math.floor(Math.random() * (max - min + 1)) + min;
  const teacherID = "T_" + teacherCode.toString();

  const existingDocument = await this.constructor.findOne({ teacherID });
  if (existingDocument) {
    return this.pre("save", next);
  }

  this.teacherID = teacherID;
  next();
});

module.exports = mongoose.model("Teacher", teacherSchema);
