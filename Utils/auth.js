const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, resp) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    console.log(resp);
    req.user = resp.user;
    next();
  });
};
