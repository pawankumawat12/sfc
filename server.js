const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const { ConnectDb } = require("./config/db");
const { AppConfig } = require("./config/AppConfig");
const { IndexRoute } = require("./routes");
const multererrorhandler = require("./middleware/multererrorhandler");
const { AdminCredentials } = require("./seed/seed");
const cookieParser = require("cookie-parser");

const app = express();

// ✅ CORS setup (local + live frontend दोनों allow)
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://zippy-treacle-5011d7.netlify.app",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/v1", IndexRoute);

// multer error handler
app.use(multererrorhandler);

// ✅ SERVER START (सब कुछ यहीं होगा)
const startServer = async () => {
  try {
    // 1. DB connect
    await ConnectDb();
    console.log("MongoDB connected");

    // 2. Seed admin (DB connect के बाद)
    await AdminCredentials();

    // 3. Start server
    app.listen(AppConfig.port, "0.0.0.0", () => {
      console.log(`Server running on port ${AppConfig.port}`);
    });
  } catch (error) {
    console.error("Server start failed:", error);
  }
};

// start
startServer();
