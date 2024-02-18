const express = require("express");
const router = express.Router();
const auth = require("../Utils/auth");
const qrDisplayController = require("../controller/qrDisplayController");

router.get("/getData/:id", qrDisplayController.getQRAttendenceData);

router.get(
  "/getQRCodeData/:classCode",
  auth.authenticateToken,
  qrDisplayController.getQRCodeData
);

module.exports = router;
