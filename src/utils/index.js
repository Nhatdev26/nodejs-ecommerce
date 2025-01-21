"use strict";
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
var _ = require("lodash");

const generateRandomString = () => {
  return CryptoJS.SHA256(Math.random().toString()).toString().substring(0, 32);
};

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const generateRandomInteger = () => {
  const randomInteger = crypto.randomInt(0, Math.pow(2, 32));
  return randomInteger;
};

const replacePlaceholders = ({ template, params }) => {
  Object.keys(params).forEach((key) => {
    const placeholder = `{{${key}}}`;
    const regex = new RegExp(placeholder, "g");
    template = template.replace(regex, params[key]);
  });
  return template;
};

module.exports = {
  generateRandomString,
  getInfoData,
  generateRandomInteger,
  replacePlaceholders,
};
