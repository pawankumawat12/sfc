const multer = require("multer");

const multererrorhandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Invalid file upload",
    });
  }

  next();
};
module.exports = multererrorhandler;
