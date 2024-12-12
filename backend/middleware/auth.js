// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No auth token" });
    }

    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Please authenticate" });
  }
};

module.exports = auth;
