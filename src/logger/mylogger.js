"use strict";
const winston = require("winston");
const { v4: uuidv4 } = require("uuid");
require("winston-daily-rotate-file");
const { combine, timestamp, json, align, printf } = winston.format;
class MyLogger {
  constructor() {
    const formatPrint = printf(
      ({ level, message, context, requestId, timestamp, metadata }) => {
        return `${timestamp} ::${level} ::${context} ::${requestId} ::${message}::${JSON.stringify(
          metadata
        )} `;
      }
    );

    this.logger = winston.createLogger({
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        formatPrint
      ),
      transports: [
        new winston.transports.Console(),

        new winston.transports.DailyRotateFile({
          level: "info",
          dirname: "src/logs",
          filename: "application-%DATE%.info.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true, // luu tru file truoc khi xoa
          maxSize: "20m", // dung luong file log
          maxFiles: "14d", // han xoa file
        }),
        new winston.transports.DailyRotateFile({
          level: "error",
          dirname: "src/logs",
          filename: "application-%DATE%.error.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true, // luu tru file truoc khi xoa
          maxSize: "20m", // dung luong file log
          maxFiles: "14d", // han xoa file
        }),
      ],
    });
  }
  commonParams(params) {
    let context, req, metadata;
    if (!Array.isArray(params)) {
      context = params;
    } else {
      [context, req, metadata] = params;
    }

    const requestId = req?.requestId || uuidv4();
    return {
      requestId,
      context,
      metadata,
    };
  }

  info(message, params) {
    const paramLog = this.commonParams(params);
    const logObject = Object.assign(
      {
        message,
      },
      paramLog
    );
    this.logger.info(logObject);
  }
  error(message, params) {
    const paramLog = this.commonParams(params);
    const logObject = Object.assign(
      {
        message,
      },
      paramLog
    );
    this.logger.error(logObject);
  }
}

module.exports = new MyLogger();
