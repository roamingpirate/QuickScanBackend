const Class = require("../models/class");
const Teacher = require("../models/teacher");
const Student = require("../models/student");
const ClassAR = require("../models/classAttendenceRecord");
const StudentAR = require("../models/studentAttendenceRecord");
const encrypt = require("../Utils/encryption");

exports.markAttendence = async (req, res) => {
  try {
    const { studentID, scannedTimeStamp, qrCodeData } = req.body;

    console.log("attendence Data");
    console.log(req.body);
    console.log("actual Time");
    console.log(Date.now());

    //Check QR Code Validity

    const decryptedMessage = encrypt.decryptQRCode(qrCodeData);
    const parts = decryptedMessage.split("_");
    const classID = parts[0];
    const qrTimeStamp = parts[1];
    const date = parts[2];
    console.log(date);
    const TimeDiff = parseInt(scannedTimeStamp) - parseInt(qrTimeStamp);
    console.log("QRScanTime");
    console.log(qrTimeStamp);
    console.log("Time Diff");
    console.log(TimeDiff.toString());

    if (TimeDiff > 2) {
      console.log("huhu");
      return res
        .status(200)
        .json({ message: "Please Scan Again! Delay in Scanning" });
    }

    // Checking If StudentID and ClassID are Valid
    const student = await Student.findOne({ studentID: studentID });
    if (!student) {
      return res.status(401).json({ message: "Student Data not Found" });
    }

    const classD = await Class.findOne({ classID: classID });
    if (!classD) {
      return res.status(401).json({ message: "Class Data not Found" });
    }

    let classAR = await ClassAR.findOne({
      classID: classID,
      date: date,
    });

    if (!classAR) {
      classAR = await ClassAR({
        classID: classID,
        date: date,
      });
    }

    if (classAR.students.includes(studentID)) {
      return res
        .status(200)
        .json({ message: "Attendence Already Marked!", classData: classD });
    }

    classAR.students.push(studentID);
    console.log(classAR);
    classAR.save();

    let studentAR = await StudentAR.findOne({
      classID: classID,
      studentID: studentID,
    });

    if (!studentAR) {
      studentAR = await StudentAR({
        classID: classID,
        studentID: studentID,
      });
    }

    studentAR.datesPresent.push(date);
    console.log(studentAR);
    studentAR.save();

    return res
      .status(200)
      .json({ message: "Attendence Marked Successfully!", classData: classD });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getClassAttendence = async (req, res) => {
  try {
    const classID = req.params.classID;
    const date = req.query.date;
    console.log(date);

    let classAR = await ClassAR.findOne({
      classID: classID,
      date: date,
    });

    if (!classAR) {
      return res.send([]);
    }

    res.send(classAR.students);
    console.log(classAR.students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getClassPresentStudent = async (req, res) => {
  try {
    const classID = req.params.classID;
    const date = req.query.date;
    console.log(date);

    let classAR = await ClassAR.findOne({
      classID: classID,
      date: date,
    });

    if (!classAR) {
      return res.status(200).send("0");
    }
    console.log(classAR.students.length);

    res.status(200).send(classAR.students.length.toString());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getClassTotalStudent = async (req, res) => {
  try {
    const classID = req.params.classID;
    let classD = await Class.findOne({ classID: classID });

    if (!classD) {
      return res.status(200).send("0");
    }
    console.log(classD.Students.length);

    res.status(200).send(classD.Students.length.toString());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
