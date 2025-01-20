const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const app = express();
const morgan = require("morgan");
const { checkOverLoad } = require("./helpers/check.connect");
const myLogger = require("./logger/mylogger.js");
const { v4: uuidv4 } = require("uuid");
const { sanitizeData } = require("./helpers/sanitize.data.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// middleware để gán requestId cho mỗi request
app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"];
  req.requestId = requestId ? requestId : uuidv4();
  myLogger.info(`Received request :: ${req.method} ::`, [
    req.path,
    {
      requestId: req.requestId,
    },
    req.method === "POST" ? sanitizeData(req.body) : sanitizeData(req.query),
  ]);

  next();
});

// init database
require("./configs/mongodb.config");
//checkOverLoad();

// function start time request
app.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

// init router
app.use("", require("./routes/index"));

// handle error

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  const startTime = req.startTime || Date.now();
  const responseTime = Date.now() - startTime;

  const resMessage = `${
    error.status
  } - ${responseTime}ms - Response :: ${JSON.stringify(error)}  `;

  myLogger.error(resMessage, [
    req.path,
    { requestId: req.requestId },
    { message: error.message },
  ]);
  res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: error.stack,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
