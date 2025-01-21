"use strict";
const userModel = require("../models/user.model");
const { ConflictRequestError } = require("../core/error.response");
const { sendEmailOTPToken } = require("./email.service");
const { newOtp } = require("./otp.service");

class UserService {
  newUser = async ({ email = null, captcha = null }) => {
    //1. check email exist in database
    const user = await userModel.findOne({ usr_email: email }).lean();
    console.log("user", user);

    if (user) {
      throw new ConflictRequestError("Email already exist");
    }
    // 2. send token via email to user
    const response = await sendEmailOTPToken({ email });
    console.log("response", response);
    return {
      message: "Send email success",
      data: response,
    };
  };

  checkLoginEmailToken = async ({}) ={}
}

module.exports = new UserService();
