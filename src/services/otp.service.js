"use strict";

const otpModel = require("../models/otp.model");
const { generateRandomInteger } = require("../utils");

const findOtpByEmail = async ({ email }) => {
  return await otpModel.findOne({ otp_email: email }).lean();
};
const newOtp = async ({ email }) => {
  const token = generateRandomInteger();
  console.log("token", token);
  const newOtp = await otpModel.create({
    otp_token: token,
    otp_email: email,
  });

  return newOtp;
};

module.exports = { newOtp, findOtpByEmail };
