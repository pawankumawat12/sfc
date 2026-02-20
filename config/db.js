const mongoose = require("mongoose");
const { AppConfig } = require("./AppConfig");

const ConnectDb = async () => {
  try {
    const connect = await mongoose.connect(AppConfig.MongoUri);
    console.log(`Mongodb connected:  ${connect.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed");
    console.error(error.message);
    process.exit(1);
  }
};
module.exports = { ConnectDb };
