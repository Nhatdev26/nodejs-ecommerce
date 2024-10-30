const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const app = express();
const morgan = require("morgan");
const { checkOverLoad } = require("./helpers/check.connect");

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init database
require("./configs/mongodb.config");
//checkOverLoad();

// init router

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
