const User = require("../models/users");
const Teacher = require("../models/teacher");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.validateInputs = v = [
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("name").trim().notEmpty(),
  body("instituteName").trim().notEmpty(),
  body("deviceId").trim().notEmpty(),
];

exports.registerUser = async (req, res) => {
  try {
    const { email, password, name, instituteName, deviceId, accountType } =
      req.body;

    // Checking that input format are valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Checking that email and deviceID are unique
    const existingUser = await User.findOne({
      $or: [{ email }, { deviceId }],
    });

    /* if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email already exists" });
      } else {
        return res.status(400).json({ error: "Device is already in use by another account" });
      }
    }*/

    // Creating hashed Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User({
      name: name,
      email: email,
      password: hashedPassword,
      instituteName: instituteName,
      deviceId: deviceId,
      accountType: accountType,
    });

    await user.save();

    const token = jwt.sign({ user }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.userLogin = async (req, res) => {
  console.log("jello");
  console.log(req.body);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ user }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.QRDisplayLogin = async (req, res) => {
  console.log(req.body);
  const { email, password, classID } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.accountType === "student") {
      return res
        .status(401)
        .json({ message: "Cannot Login with student credentials" });
    }

    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res
        .status(401)
        .json({ message: "Please complete your registration in app first" });
    }

    const classList = teacher.classesCreated;

    if (classList.includes(classID)) {
      console.log(`class found`);
    } else {
      return res
        .status(401)
        .json({ message: "No class found with the given code" });
    }

    const token = jwt.sign({ user }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUser = async (req, res) => {
  const user = req.user;
  res.json(user);
};
