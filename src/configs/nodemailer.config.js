"use strict";

const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

// Khởi tạo OAuth2Client với Client ID và Client Secret
const myOAuth2Client = new OAuth2Client(
  process.env.EMAIL_CLIENT_ID,
  process.env.EMAIL_CLIENT_SECRET
);
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: process.env.EMAIL_REFRESH_TOKEN,
});

const generateAccessToken = async () => {
  try {
    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    const myAccessToken = myAccessTokenObject?.token;
    return myAccessToken;
  } catch (error) {
    console.error(`Error occurs: ${error}`);
    return error;
  }
};

const createTransport = async () => {
  const accessToken = await generateAccessToken();

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // smtp.gmail.com
    port: process.env.EMAIL_PORT, // 587
    secure: false,
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.EMAIL_CLIENT_ID,
      clientSecret: process.env.EMAIL_CLIENT_SECRET,
      refreshToken: process.env.EMAIL_REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  return transport;
};
module.exports = { createTransport };
