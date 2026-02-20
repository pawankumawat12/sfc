const { AppConfig } = require("../../config/AppConfig");
const {
  GenerateToken,
  GenerateRefreshToken,
} = require("../../middleware/Auth");
const AdminAuth = require("../../models/Auth/Admin");
const bcrypt = require("bcrypt");

const SignUpUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email or password is required",
      });
    }

    // check email exists
    const existEmail = await AdminAuth.findOne({ email });
    if (existEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await AdminAuth.create({
      email,
      password: hashedPassword,
      isActive: true,
    });

    const AccessToken = GenerateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });
    const RefreshToken = GenerateRefreshToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    //cookie store
    res.cookie("AccessToken", AccessToken, {
      httpOnly: AppConfig.cookieHttponly,
      secure: AppConfig.cookieSecure,
      sameSite: AppConfig.cookieSamesite,
      maxAge: 30 * 60 * 1000,
    });

    res.cookie("RefreshToken", RefreshToken, {
      httpOnly: AppConfig.cookieHttponly,
      secure: AppConfig.cookieSecure,
      sameSite: AppConfig.cookieSamesite,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "SignUp successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { SignUpUser };
