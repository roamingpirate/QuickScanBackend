const Teacher = require("../models/teacher");

exports.registerTeacherData = async (req, res) => {
  try {
    const user = req.user;
    const { instituteID, department } = req.body;

    const teacher = await Teacher({
      name: user.name,
      email: user.email,
      instituteName: user.instituteName,
      instituteID: instituteID,
      department: department,
    });

    await teacher.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getTeacherData = async (req, res) => {
  try {
    const user = req.user;
    const email = user.email;

    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(401).json({ message: "Teacher Data not Found" });
    }

    res.json(teacher);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.isTeacherRegistered = async (req, res) => {
  const user = req.user;
  const email = user.email;

  const teacher = await Teacher.findOne({ email });
  const response = teacher ? true : false;
  res.send(response);
};
