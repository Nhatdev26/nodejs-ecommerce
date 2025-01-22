"use strict";
const userModel = require("../models/user.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  ConflictRequestError,
} = require("../core/error.response");

const { sendEmailOTPToken } = require("./email.service");
const { newOtp, checkOtpToken } = require("./otp.service");
const { v4: uuidv4 } = require("uuid");

const { generateRandomString, getInfoData } = require("../utils");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyToken } = require("../auth/authUtils");
const { createApiKey } = require("./apiKey.service");
const { createUser } = require("../models/repositories/user.repository");

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

  checkLoginEmailOtpToken = async (token) => {
    //1. check Otp token exist in database
    const { otp_email: email, otp_token } = await checkOtpToken({
      otp_token: token,
    });

    if (!email) {
      throw new NotFoundError(" Email OTP Token not found");
    }

    // check email exist in database
    const hasUser = await findUserByEmail({ email });
    if (hasUser) {
      throw new ConflictRequestError("Email already exist");
    }
    // 2. Create new user
    const hashPassword = bcrypt.hashSync(email, 10);

    const newUser = await createUser({
      usr_slug: "xxxx",
      usr_name: email,
      usr_email: email,
      usr_password: hashPassword,
      usr_salt: 10,
    });

    if (newUser) {
      // 3.Create public Key and private Key
      const publicKey = generateRandomString();
      const privateKey = generateRandomString();

      // 4. Save publicKey and privateKey to KeyToken
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey,
        refreshToken: null,
      });

      if (!keyStore) {
        throw new BadRequestError("KeyStore Error !!!");
      }

      // 5. create tokenPair

      const tokens = await createTokenPair(
        {
          userId: newUser._id,
          email: newUser.usr_email,
        },
        publicKey,
        privateKey
      );

      console.log("Created Token Success: ", tokens);

      // api Key
      const newKey = await createApiKey(generateRandomString());

      return {
        user: getInfoData({
          fields: ["_id", "usr_name", "usr_email"],
          object: newUser,
        }),
        tokens,
        apiKey: getInfoData({
          fields: ["key"],
          object: newKey,
        }),
      };
    }
  };
}

const findUserByEmail = async ({ email }) => {
  return await userModel.findOne({ usr_email: email }).lean();
};

module.exports = new UserService();
