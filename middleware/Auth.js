const jwt = require("jsonwebtoken");
const { AppConfig } = require("../config/AppConfig");

//access token
const GenerateToken = (payload) => {
  return jwt.sign(payload, AppConfig.jwt_secret_access, {
    expiresIn: "30m",
  });
};

//refresh token
const GenerateRefreshToken = (payload) => {
  return jwt.sign(payload, AppConfig.jwt_secret_refresh, {
    expiresIn: "7d",
  });
};

//middleware for check authentication
const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.AccessToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token",
      });
    }
    const decoded = jwt.verify(token, AppConfig.jwt_secret_access);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  GenerateToken,
  GenerateRefreshToken,
  authMiddleware,
};
