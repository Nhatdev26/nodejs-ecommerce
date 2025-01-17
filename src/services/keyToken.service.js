"use strict";
const { Types } = require("mongoose");
const keyTokenModel = require("../models/keyToken.model");
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = { user: userId },
        update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
        options = { upsert: true, new: true };

      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      throw error;
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken });
  };
  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };

  static deleteKeyByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({ user: new Types.ObjectId(userId) });
  };

  static removeTokenById = async ({ id }) => {
    return await keyTokenModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
  };
}

module.exports = KeyTokenService;
