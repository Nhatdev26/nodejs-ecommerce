"use strict";

const { ForbiddenError } = require("../core/error.response");
const { FORBIDDEN } = require("../core/statusCodes");
const { findApiKeyById } = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      throw new ForbiddenError("Forbidden ApiKey Error ");
    }
    const objKey = await findApiKeyById(key);
    if (!objKey) {
      throw new ForbiddenError("Forbidden ApiKey Error");
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log(error);
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      throw new ForbiddenError("Permission apikey denied");
    }
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      throw new ForbiddenError("Permission apikey denied");
    }
    return next();
  };
};
module.exports = { apiKey, permission };
