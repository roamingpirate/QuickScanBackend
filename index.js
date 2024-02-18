const express = require("express");
const userRoutes = require("./routes/userRoutes");
const qrDisplayRoutes = require("./routes/qrDisplayRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const classRoutes = require("./routes/classRoutes");
const attendenceRoutes = require("./routes/attendenceRoutes");
const encrypt = require("./Utils/encryption");
require("dotenv").config();
require("./models/db");
const cors = require("cors");

app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use("/user", userRoutes);

app.use("/qrDisplay", qrDisplayRoutes);

app.use("/teacher", teacherRoutes);

app.use("/student", studentRoutes);

app.use("/class", classRoutes);

app.use("/attendence", attendenceRoutes);

app.get("/", (req, res) => {
  res.send("hello pello");
  const em = encrypt.encryptQRCode("hello");
  console.log(em);
  const dm = encrypt.decryptQRCode("7e4a5d7a743876ee3915488cd3895dd1");
  console.log(dm);
});

app.listen(8080, () => {
  console.log("Server Up");
});
