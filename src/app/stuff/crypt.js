const jwt = require("jsonwebtoken");

const JWT_SECRET = "igen";

const encrypt = async (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: payload.expiresIn });
};

module.exports = { encrypt };
