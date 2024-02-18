const Student = require("../models/student");

exports.registerStudentData = async (req, res) => {
  try {
    const user = req.user;
    const { instituteID, department, degree, rollNo } = req.body;

    const student = await Student({
      name: user.name,
      email: user.email,
      instituteName: user.instituteName,
      instituteID: instituteID,
      department: department,
      degree: degree,
      rollNo: rollNo,
    });

    console.log(student);

    await student.save();
    console.log(student);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getStudentData = async (req, res) => {
  try {
    const user = req.user;
    const email = user.email;
    const studentID = req.query.studentID;

    let student;

    if (studentID) {
      student = await Student.findOne({ studentID });
    } else {
      student = await Student.findOne({ email });
    }

    if (!student) {
      return res.status(401).json({ message: "Student Data not Found" });
    }

    res.json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.isStudentRegistered = async (req, res) => {
  const user = req.user;
  const email = user.email;

  const student = await Student.findOne({ email });
  const response = student ? true : false;
  res.send(response);
};
