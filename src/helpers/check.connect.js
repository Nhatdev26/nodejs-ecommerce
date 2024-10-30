"use strict";

const { default: mongoose } = require("mongoose");
const os = require("os");
const _SECONDS = 5000;

const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connection::: ${numConnection}`);
};

const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length; //Lấy số lượng kết nối hiện tại
    const numCores = os.cpus().length; // Lấy số lượng lõi CPU của máy chủ
    const memoryUse = process.memoryUsage().rss; // Lấy dung lượng bộ nhớ đang sử dụng trong ram
    // server chiu dk 5 connect
    const maxConnections = numCores * 5;

    console.log(`Active connections ::: ${numConnection}`);
    console.log(`Memory usage ::: ${memoryUse / 1024 / 1024} MB`);

    if (numConnection > maxConnections) {
      console.log("Connection overload detected");
    }
  }, _SECONDS);
};

module.exports = { countConnect, checkOverLoad };
