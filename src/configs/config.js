"use strict";

const config = {
  app: {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
  },
  db: {
    enable: process.env.MONGO_ENABLE,
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    name: process.env.MONGO_DATABASE,
  },
};

module.exports = config;
