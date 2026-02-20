export const AppConfig = {
  // db data
  port: process.env.PORT,
  MongoUri: process.env.MONGO_URI,

  //admin data
  Admin_email: process.env.EMAIL,
  Admin_password: process.env.PASSWORD,
  Admin_Name: process.env.ADMIN_NAME,
  Admin_Phone: process.env.ADMIN_PHONE,
  Admin_Role: process.env.ADMIN_ROLE,

  //jwt data
  jwt_secret_access: process.env.JWT_SECRET_ACCESS,
  jwt_secret_refresh: process.env.JWT_SECRET_REFRESH,

  //COOKIE TYPES
  cookieHttponly: process.env.HTTPONLY,
  cookieSecure: process.env.SECURE,
  cookieSamesite: process.env.SAMESITE,
};
