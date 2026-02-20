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
const startServer = async () => {
  await ConnectDb();
}
 startServer();
app.use(  
  cors({
    origin: "http://localhost:5173", 
    credentials: true,  })
);

app.use(express.json());
app.use(cookieParser());
// ROUTES
app.use("/api/v1", IndexRoute);
AdminCredentials();
//image multer handler
app.use(multererrorhandler);

//  SERVER START
app.listen(AppConfig.port, "0.0.0.0", () => {
  console.log(`Server running on port ${AppConfig.port}`);
});
