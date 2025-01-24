"use strict";
const JWT = require("jsonwebtoken");
const { error } = require("../logger/mylogger");
const { asyncHandler } = require("../helpers/async.handle");
const {
  AuthFailureError,
  NotFoundError,
  ForbiddenError,
} = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "refresh-token",
  CLIENT_ID: "x-client-id",
  BEARER: "Bearer",
};

// url refreshToken
const ALLOWED_REFRESH_URL = [
  "/v1/api/shops/refresh-token",
  "/v1/api/users/refresh-token",
];

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "1 days",
    });

    // refreshToken
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "2 days",
    });

    // verify Token
    verifyToken(accessToken, publicKey, (error, decode) => {
      if (error) {
        console.log("error verify Token::: ", error);
      } else {
        console.log("Decode verify::: ", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Create TokenPair Error :::", error);
  }
};

const verifyToken = (token, keySecret) => {
  return JWT.verify(token, keySecret);
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1. Check userId missing ?
    2. Check KeyStore with userId
    3. Check if refreshToken is present in headers
      3.1. verify refreshToken 
      3.2. Validate if decoded userId matches the request userId
      3.3. Check url req.originalUrl xem có thỏa mãn url refresToken ko ?
      3.3. OK all for refreshToken, pass to the next middleware
    4. Get accessToken 
    5. Verify accessToken
    6. Validate if decoded userId matches the request userId
    7. OK all for accessToken, pass to the next middleware

  */

  // step 1
  const userId = req.headers[HEADER.CLIENT_ID];
  console.log("userId::: ", userId);
  if (!userId) throw new AuthFailureError("Invalid Request");

  // step 2
  const keyStore = await KeyTokenService.findByUserId(userId);

  if (!keyStore) throw new NotFoundError("Resource not found");

  // step 3
  const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
  if (refreshToken) {
    try {
      const decodeUser = verifyToken(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Invalid userId");

      // check url refreshToken có giống với url gốc ko ?
      if (!ALLOWED_REFRESH_URL.includes(req.originalUrl)) {
        throw new ForbiddenError(
          "RefreshToken Is not allowed for this endpoint "
        );
      }
      req.user = decodeUser;
      req.keyStore = keyStore;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  // step 4
  const accessToken = req.headers[HEADER.AUTHORIZATION];

  if (!accessToken) throw new ForbiddenError("Invalid Request ");
  try {
    const decodeUser = verifyToken(accessToken, keyStore.publicKey);

    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid userId");
    req.user = decodeUser;
    req.keyStore = keyStore;

    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = { createTokenPair, authentication, verifyToken };
