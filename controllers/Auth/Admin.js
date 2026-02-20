const { AppConfig } = require("../../config/AppConfig");
const {
  GenerateToken,
  GenerateRefreshToken,
} = require("../../middleware/Auth");
const AdminAuth = require("../../models/Auth/Admin");
const bcrypt = require("bcrypt");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const Admin = await AdminAuth.findOne({ email });
    if (!Admin) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, Admin.password);
    if (!isMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }

    //status change active
    Admin.isActive = true;
    await Admin.save();

    //tokens
    const AccessToken = GenerateToken({
      id: Admin._id,
      email: Admin.email,
      role: Admin.role,
    });
    const RefreshToken = GenerateRefreshToken({
      id: Admin._id,
      email: Admin.email,
      role: Admin.role,
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

    res.status(200).json({
      success: true,
      message: "Login successfully",
      admin: {
        name: Admin.name,
        phone: Admin.phone,
        email: Admin.email,
        role: Admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong during login",
      error: error.message,
    });
  }
};

//create

const CreateUserByAdminOrSubadmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // validation
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password and role required",
      });
    }

    // role permission logic
    if (role === "sub_admin" && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can create subadmin",
      });
    }

    if (role === "owner" && !["admin", "sub_admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only admin or subadmin can create owner",
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
      role,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: `${role} created successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { adminLogin, CreateUserByAdminOrSubadmin };
