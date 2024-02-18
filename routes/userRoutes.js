const express = require("express");
const router = express.Router();
const auth = require("../Utils/auth");
const userController = require("../controller/userController");

router.post(
  "/register",
  userController.validateInputs,
  userController.registerUser
);

router.post("/login", userController.userLogin);

router.get("/getUser", auth.authenticateToken, userController.getUser);

router.post("/qrDisplaylogin",userController.QRDisplayLogin);

module.exports = router;
