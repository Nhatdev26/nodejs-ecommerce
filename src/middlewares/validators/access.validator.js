"use strict";

const { ForbiddenError } = require("../../core/error.response");

const validateLoginRequest = (req, res, next) => {
  const loginRequest = req.body;

  // check email và mật khẩu tồn tại
  if (!loginRequest || !loginRequest.email || !loginRequest.password) {
    throw new ForbiddenError("Missing required fields.");
  }

  // check email (đinh dạng)
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(loginRequest.email)) {
    throw new ForbiddenError("Email invalid format !!!");
  }

  // check email length
  if (loginRequest.email.length < 8) {
    throw new ForbiddenError("Email must be at least 8 characters long.");
  }

  // Check mật khẩu (ít nhất 8 ký tự, chứa chữ và số)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(loginRequest.password)) {
    throw new ForbiddenError(
      "Password must be at least 8 characters long and contain both letters and numbers."
    );
  }
  // Kiểm tra độ dài mật khẩu (ít nhất 8 ký tự)
  if (loginRequest.password.length < 8) {
    throw new ForbiddenError("Password must be at least 8 characters long.");
  }

  return next();
};

const validateRegister = (req, res, next) => {
  const registerRequest = req.body;
  // Check nếu tên, email và mật khẩu tồn tại
  if (
    !registerRequest ||
    !registerRequest.name ||
    !registerRequest.email ||
    !registerRequest.password
  ) {
    throw new ForbiddenError("Missing required fields.");
  }

  // Check tên (ít nhất 8 ký tự)
  if (registerRequest.name.length < 8) {
    throw new ForbiddenError("Name invalid !!!");
  }

  // Check email (định dạng cơ bản)
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(registerRequest.email)) {
    throw new ForbiddenError("Email invalid format !!!");
  }

  // Kiểm tra độ dài email (ít nhất 8 ký tự)
  if (registerRequest.email.length < 8) {
    throw new ForbiddenError("Email must be at least 8 characters long.");
  }

  // Check mật khẩu (ít nhất 8 ký tự, chứa chữ và số)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(registerRequest.password)) {
    throw new ForbiddenError(
      "Password must be at least 8 characters long and contain both letters and numbers."
    );
  }

  // Kiểm tra độ dài mật khẩu (ít nhất 8 ký tự)
  if (registerRequest.password.length < 8) {
    throw new ForbiddenError("Password must be at least 8 characters long.");
  }

  return next();
};

module.exports = { validateLoginRequest, validateRegister };
