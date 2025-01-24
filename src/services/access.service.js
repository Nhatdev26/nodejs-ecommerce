"use strict";
const bcrypt = require("bcrypt");

const {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const shopModel = require("../models/shop.model");
const ShopService = require("./shop.service");
const { generateRandomString, getInfoData } = require("../utils");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyToken } = require("../auth/authUtils");
const { createApiKey } = require("./apiKey.service");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "001",
  READ: "002",
  DELETE: "003",
  ADMIN: "000",
};

class AccessService {
  handleRefreshToken = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;

    // step1 : check if refreshToken is reused (tái sử dụng)
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError("Something wrong happen !! Please re-login");
    }

    // step2 : Validate refreshToken (xác thực)
    if (refreshToken !== keyStore.refreshToken) {
      throw new AuthFailureError("Shop not registered !!!");
    }

    // step3 : Verify user existence (xác minh tồn tại của shop với email)
    const foundShop = await ShopService.findShopByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered !!");

    // step4 : create accessToken and refreshToken
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    // step5 : update Token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user,
      tokens,
    };
  };
  logout = async (keyStore) => {
    console.log(keyStore);
    const delKey = await KeyTokenService.removeTokenById(keyStore._id);
    console.log(delKey);
    return delKey;
  };
  login = async ({ email, password, refreshToken = null }) => {
    // 1.check email in dbs

    const foundShop = await ShopService.findShopByEmail({ email });

    if (!foundShop) throw new BadRequestError("Shop not registered !!!");

    // 2.match password
    const matchPassword = bcrypt.compareSync(password, foundShop.password);
    if (!matchPassword) throw new AuthFailureError("Authentication error !!!");

    // 3.create publicKey and privateKey
    const publicKey = generateRandomString();
    const privateKey = generateRandomString();

    // 4.create AT and RT

    let userId = foundShop._id.toString();
    console.log(userId);

    const tokens = await createTokenPair(
      { userId: userId, email },
      publicKey,
      privateKey
    );

    console.log(tokens);

    // 5. save Token in KeyToken
    await KeyTokenService.createKeyToken({
      userId: userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    // 6 . get data return login
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  signUp = async ({ name, email, password }) => {
    // 1. Check email in dbs
    const holderShop = await ShopService.findShopByEmail({ email });
    if (holderShop) {
      throw new ConflictRequestError("Shop already registered!!!");
    }

    // 2. Create new shop
    const hashPassword = bcrypt.hashSync(password, 10);
    const newShop = await ShopService.createShop({
      name,
      email,
      password: hashPassword,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // 3.Create public Key and private Key
      const publicKey = generateRandomString();
      const privateKey = generateRandomString();

      // 4. Save publicKey and privateKey to KeyToken
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
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
          userId: newShop._id,
          email: newShop.email,
        },
        publicKey,
        privateKey
      );

      console.log("Created Token Success: ", tokens);

      // api Key
      const newKey = await createApiKey(generateRandomString());

      return {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
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

module.exports = new AccessService();
