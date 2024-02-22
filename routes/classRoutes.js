const express = require("express");
const router = express.Router();
const auth = require("../Utils/auth");
const classController = require("../controller/classController");

router.post("/create", auth.authenticateToken, classController.createClass);
router.get("/:classID", auth.authenticateToken, classController.getClassData);
router.get(
  "/activateQR/:classID",
  auth.authenticateToken,
  classController.activateQR
);
router.get(
  "/deactivateQR/:classID",
  auth.authenticateToken,
  classController.deactivateQR
);
router.get(
  "/addStudent/:classID",
  auth.authenticateToken,
  classController.addStudent
);
router.get(
  "/getStudentsList/:classID",
  auth.authenticateToken,
  classController.getStudentList
);

module.exports = router;
