const express = require("express");
const router = express.Router();
const auth = require("../Utils/auth");
const attendenceController = require("../controller/attendenceController");

router.post(
  "/markAttendence",
  auth.authenticateToken,
  attendenceController.markAttendence
);

router.get(
  "/getClassAttendence/:classID",
  auth.authenticateToken,
  attendenceController.getClassAttendence
);

router.get(
  "/getClassPresentStudent/:classID",
  auth.authenticateToken,
  attendenceController.getClassPresentStudent
);

router.get(
  "/getClassTotalStudent/:classID",
  auth.authenticateToken,
  attendenceController.getClassTotalStudent
);

module.exports = router;
