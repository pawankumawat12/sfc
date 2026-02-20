const express = require("express");
const { router } = require("./AdminRoute");
const IndexRoute = express.Router();

IndexRoute.use("/", router)
module.exports = {IndexRoute}
