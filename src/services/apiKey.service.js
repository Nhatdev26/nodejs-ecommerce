"use strict";
const crypto = require("crypto");
const apiKeyModel = require("../models/apiKey.model");
const { generateRandomString } = require("../utils");

const findApiKeyById = async (key) => {
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

const createApiKey = async (key) => {
  const objKey = await apiKeyModel.create({ key, permissions: ["0000"] });
  return objKey;
};

module.exports = { findApiKeyById, createApiKey };
