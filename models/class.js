const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const classSchema = new mongoose.Schema({
  classID: {
    type: "string",
    unique: true,
  },
  className: {
    type: "string",
    required: true,
  },
  classCode: {
    type: "string",
    required: true,
  },
  subject: {
    type: "string",
    required: true,
  },
  teacherID: {
    type: "string",
    required: true,
  },
  QRStatus: {
    type: "string",
    default: "inactive",
  },
  QRActivationTime: {
    type: "number",
    default: "0"
  },
  duration: {
    type: "number",
    default: "1",
  },
  Students: [{
    rollNo: {
      type: "string", 
      required: true, 
    },
    studentID: {
      type: "string",
      required: true,
    }
  }],
});



classSchema.plugin(uniqueValidator);

classSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }
  const length = 8;
  const classID = generateRandomString(length);

  const existingDocument = await this.constructor.findOne({ classID });
  if (existingDocument) {
    return this.pre("save", next);
  }

  this.classID = classID;
  next();
});

module.exports = mongoose.model("Class", classSchema);
