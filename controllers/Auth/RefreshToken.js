const jwt = require("jsonwebtoken");
const { AppConfig } = require("../../config/AppConfig");
//refresh access token to help of  refreshtoken

const RefreshToken = async (req, res) => {
  try {
    const RefreshToken = req.cookies?.RefreshToken;
    console.log(RefreshToken, "Check toke");

    if (!RefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token! login please",
      });
    }

    const decoded = jwt.verify(RefreshToken, AppConfig.jwt_secret_refresh);

    const newAccessToken = jwt.sign(
      { id: decoded?.id, email: decoded?.email, role: decoded?.role },
      AppConfig.jwt_secret_access,
      { expiresIn: "30m" }
    );

    res.cookie("AccessToken", newAccessToken, {
      httpOnly: AppConfig.cookieHttponly,
      secure: AppConfig.cookieSecure,
      sameSite: AppConfig.cookieSamesite,
      maxAge: 30 * 60 * 1000,
    });
    res.json({ success: true });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

module.exports = { RefreshToken };
