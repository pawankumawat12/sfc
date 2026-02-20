const jwt = require("jsonwebtoken");
const { AppConfig } = require("../../config/AppConfig");
const AdminAuth = require("../../models/Auth/Admin");
const verify = async (req, res) => {
  try {
    const AccessToken = req.cookies?.AccessToken;
    if (!AccessToken) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized! please login" });
    }
    const decoded = jwt.verify(AccessToken, AppConfig.jwt_secret_access);
    const user = await AdminAuth.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = { verify };
