const express = require("express");
const router = express.Router();
const auth = require("../Utils/auth");
const teacherController = require("../controller/teacherController");

router.get("/getData", auth.authenticateToken, teacherController.getTeacherData);

router.get("/isRegistered", auth.authenticateToken, teacherController.isTeacherRegistered)

router.post("/register", auth.authenticateToken, teacherController.registerTeacherData)

module.exports = router;
