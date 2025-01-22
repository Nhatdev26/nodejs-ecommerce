"use strict";

const { createTransport } = require("../configs/nodemailer.config");
const { newOtp, findOtpByEmail } = require("./otp.service");
const { getTemplate } = require("./template.service");
const { NotFoundError } = require("../core/error.response");
const { replacePlaceholders } = require("../utils");

// tạo hàm gửi email
const sendEmailLinkVerify = async ({
  html,
  toEmail,
  subject = "Xác nhận Email đăng ký tài khoản",
  text = "Xác nhận...",
}) => {
  try {
    const mailOptions = {
      from: `"ShopDev" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject,
      text,
      html,
    };

    const transport = await createTransport(); // Await transport creation

    // Use await with sendMail instead of using a callback
    const data = await transport.sendMail(mailOptions);

    console.log("Email sent!!!", data.messageId);
  } catch (error) {
    console.error(`error send Email: ${error}`);
    return error;
  }
};

// tạo hàm gửi email OTP Token
const sendEmailOTPToken = async ({ email }) => {
  try {
    // 1. create new OTP

    const otpToken = await newOtp({ email });

    if (!otpToken) {
      throw new NotFoundError("OTP Token not found");
    }

    // // 2. get Template
    const template = await getTemplate({
      templateName: "HTML EMAIL TOKEN",
    });

    if (!template) {
      throw new NotFoundError("Template not found");
    }

    // // 3. replace placeholder
    const content = replacePlaceholders({
      template: template.tem_html,
      params: {
        link_verify: `http://localhost:3054/v1/api/user/verify-otp?token=${otpToken.otp_token}`,
      },
    });

    // 4. send email
    sendEmailLinkVerify({
      html: content,
      toEmail: email,
      subject: "Vui lòng xác nhận địa chỉ email đăng ký ShopDev ",
    });
    return "OK";
  } catch (error) {}
};

module.exports = { sendEmailOTPToken };
