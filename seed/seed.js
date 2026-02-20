const { AppConfig } = require("../config/AppConfig");
const bcrypt = require("bcrypt");
const AdminAuth = require("../models/Auth/Admin");
const AdminCredentials = async () => {
  try {
    const AdminExist = await AdminAuth.findOne({
      email: AppConfig.Admin_email,
    });
    if (AdminExist) {
      return console.log("Admin already exists");
    }

    const hashedPassword = await bcrypt.hash(AppConfig.Admin_password, 10);

    await AdminAuth.create({
      name: AppConfig.Admin_Name,
      email: AppConfig.Admin_email,
      password: hashedPassword,
      role: AppConfig.Admin_Role,
      phone: AppConfig.Admin_Phone,
    });
    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.error("Admin seeding failed");
    console.error(error);
    process.exit(1);
  }
};
module.exports = { AdminCredentials };
