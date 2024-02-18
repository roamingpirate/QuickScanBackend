const express = require("express");
const router = express.Router();
const auth = require("../Utils/auth");
const studentController = require("../controller/studentController");

router.get("/getData", auth.authenticateToken, studentController.getStudentData);

router.get("/isRegistered", auth.authenticateToken, studentController.isStudentRegistered)

router.post("/register", auth.authenticateToken, studentController.registerStudentData)

module.exports = router;
