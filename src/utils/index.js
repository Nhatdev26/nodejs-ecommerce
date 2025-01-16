"use strict";
const CryptoJS = require("crypto-js");
var _ = require("lodash");

const generateRandomString = () => {
  return CryptoJS.SHA256(Math.random().toString()).toString().substring(0, 32);
};

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

module.exports = { generateRandomString, getInfoData };
