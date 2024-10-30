const mongoose = require("mongoose");
const {
  db: { host, port, name },
} = require("./config");
const { countConnect } = require("../helpers/check.connect");

const connectString = `mongodb://${host}:${port}/${name}`;
const MAX_POOL_SIZE = 50;
const TIME_OUT_CONNECT = 3000; // thời gian chờ tối đa

class Database {
  constructor() {
    this.connect();
  }

  async connect() {
    try {
      mongoose.set("debug", true); // Bật debug log
      mongoose.set("debug", { color: true }); // Bật màu cho log
      await mongoose.connect(connectString, {
        serverSelectionTimeoutMS: TIME_OUT_CONNECT, // Thời gian chờ
        maxPoolSize: MAX_POOL_SIZE, // Giới hạn số kết nối trong pool
      });
      console.log("MongoDB connected to db success");
      countConnect();
      this.handleConnectEvents();
    } catch (error) {
      console.error("MongoDB connection error:", error);
    }
  }

  // Lắng nghe các sự kiện kết nối MongoDB
  handleConnectEvents() {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.error("MongoDB disconnected");
    });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;
