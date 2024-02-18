const Class = require("../models/class");
const Teacher = require("../models/teacher");
const Student = require("../models/student");

exports.createClass = async (req, res) => {
  try {
    const { className, classCode, subject, teacherID } = req.body;

    // Creating Class
    const classData = await Class({
      className: className,
      classCode: classCode,
      subject: subject,
      teacherID: teacherID,
    });
    console.log(classData);
    await classData.save();

    // Updating teacher Data entry
    const teacher = await Teacher.findOne({ teacherID });
    if (!teacher) {
      return res.status(404).json({ message: "teacher not found" });
    }
    teacher.classesCreated.push(classData.classID);
    await teacher.save();

    // successful response
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getClassData = async (req, res) => {
  try {
    const classID = req.params.classID;
    const classData = await Class.findOne({ classID });
    if (!classData) {
      return res.status(401).json({ message: "Class Data not Found" });
    }
    console.log(classData);
    res.json(classData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.activateQR = async (req, res) => {
  try {
    const classID = req.params.classID;
    const duration = req.query.duration;
    const updatedItem = await Class.findOneAndUpdate(
      { classID: classID },
      {
        ["QRStatus"]: "active",
        ["QRActivationTime"]: Math.floor(new Date().getTime() / 1000),
        ["duration"]: duration,
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).send("Class not found");
    }
    console.log(updatedItem);

    res.send(updatedItem);

    setTimeout(async () => {
      console.log("After Interval");
      const updatedItem = await Class.findOneAndUpdate(
        { classID: classID },
        {
          ["QRStatus"]: "inactive",
          ["QRActivationTime"]: 0,
        },
        { new: true }
      );
      console.log(updatedItem);
    }, duration * 60000);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addStudent = async (req, res) => {
  try {
    const classID = req.params.classID;
    const studentID = req.query.studentID;
    const rollNo = req.query.rollNo;

    console.log(classID, studentID, rollNo);

    const student = await Student.findOne({ studentID });

    if (!student) {
      return res.status(200).json({ message: "Student Not Found" });
    }

    const classD = await Class.findOne({ classID });

    if (!classD) {
      console.log("No class found");
      return res.status(200).json({ message: "Class Not Found" });
    }

    const classJoined = student.classesJoined;
    if (classJoined.includes(classID)) {
      return res.status(200).json({ message: "Class Already Joined" });
    }

    const studentsList = classD.Students;

    if (studentsList.find((obj) => obj.rollNo === rollNo)) {
      return res.status(200).json({ message: "Roll No already in use!" });
    }

    const newStudentData = {
      rollNo: rollNo,
      studentID: studentID,
    };
    student.classesJoined.push(classID);

    classD.Students.push(newStudentData);

    student.save();
    classD.save();

    console.log(classD);
    res.send(classD);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getStudentList = async (req, res) => {
  try {
    const classID = req.params.classID;

    const classD = await Class.findOne({ classID });

    const studentsList = classD.Students;
    console.log(studentsList);
    studentsList.sort((a, b) => parseInt(a.rollNo) - parseInt(b.rollNo));
    res.send(studentsList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deactivateQR = async (req, res) => {
  try {
    const classID = req.params.classID;

    const updatedItem = await Class.findOneAndUpdate(
      { classID: classID },
      {
        ["QRStatus"]: "inactive",
        ["QRActivationTime"]: 0,
      },
      { new: true }
    );
    console.log("pepo");
    console.log(updatedItem);
    res.send("Success");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
