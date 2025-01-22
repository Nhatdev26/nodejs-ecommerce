"use strict";

const { NotFoundError } = require("../core/error.response");
const otpModel = require("../models/otp.model");
const { generateRandomInteger } = require("../utils");

const findOtpByEmail = async ({ email }) => {
  return await otpModel.findOne({ otp_email: email }).lean();
};
const newOtp = async ({ email }) => {
  const token = generateRandomInteger();

  const newOtp = await otpModel.create({
    otp_token: token,
    otp_email: email,
  });

  return newOtp;
};
const checkOtpToken = async ({ otp_token }) => {
  const otpToken = await otpModel.findOne({ otp_token }).lean();

  if (!otpToken) {
    throw new NotFoundError("Otp token not found");
  }

  // delete token after check
  await otpModel.deleteOne({ otp_token });
  return otpToken;
};

module.exports = { newOtp, findOtpByEmail, checkOtpToken };
