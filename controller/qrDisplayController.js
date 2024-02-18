const encrypt = require("../Utils/encryption");

function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const formattedDate = `${year}-${month < 10 ? "0" : ""}${month}-${
    day < 10 ? "0" : ""
  }${day}`;
  return formattedDate;
}

exports.getQRAttendenceData = async (req, res) => {
  const getQRAttendenceCode = req.params.id;

  //getData from db

  const data = {
    Subject: "QR code attendence",
    Faculty: "Ankit Pandit",
  };
  res.json(data);
};

exports.getQRCodeData = async (req, res) => {
  const startTime = parseInt(req.query.startTime, 10);
  const interval = 1;
  const classCode = req.params.classCode;
  const date = getCurrentDate();
  const data = [];

  for (let i = 0; i < 30; i++) {
    let time = (startTime + i * interval).toString();
    let message = classCode + "_" + time + "_" + date;
    let qrcode = encrypt.encryptQRCode(message);
    const dm=encrypt.decryptQRCode(qrcode.toString());
    console.log(dm);
    data.push({ key: time, value: qrcode });
  }

  res.json(data);
  console.log("done");
};
