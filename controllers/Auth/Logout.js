const { AppConfig } = require("../../config/AppConfig");

const logout = async (req, res) => {
  try {
    const AccessToken = req.cookies.AccessToken;
    const RefreshToken = req.cookies.RefreshToken;
    if (!AccessToken || !RefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Already logged out",
      });
    }
    res.clearCookie("AccessToken", {
      httpOnly: true,
      secure: AppConfig.cookieSecure,
      sameSite: AppConfig.cookieSamesite,
    });
    res.clearCookie("RefreshToken", {
      httpOnly: true,
      secure: AppConfig.cookieSecure,
      sameSite: AppConfig.cookieSamesite,
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong during logout",
      error: error.message,
    });
  }
};

module.exports = { logout };
