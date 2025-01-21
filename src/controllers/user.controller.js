"use strict";

const { CREATED } = require("../core/success.response");
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
  checkLoginEmailToken = async (req, res) => {};
}

module.exports = new UserController();
