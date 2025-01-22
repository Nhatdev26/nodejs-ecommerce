"use strict";

const { CREATED, OK } = require("../core/success.response");
const userService = require("../services/user.service");

class UserController {
  newUser = async (req, res, next) => {
    CREATED(
      res,
      "Create new user success",
      await userService.newUser({ email: req.body.email })
    );
  };

  // check user token via email
  checkLoginEmailToken = async (req, res, next) => {
    const { token } = req.query;

    OK(
      res,
      "Check login email token success",
      await userService.checkLoginEmailOtpToken(token)
    );
  };
}

module.exports = new UserController();
