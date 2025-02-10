"use strict";

const { OK, CREATED } = require("../core/success.response");
const accessService = require("../services/access.service");

class AccessController {
  refreshToken = async (req, res, next) => {
    OK(
      res,
      "Logout Success !!!",
      await accessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      })
    );
  };
  logout = async (req, res, next) => {
    OK(res, "Logout Success !!!", await accessService.logout(req.keyStore));
  };

  login = async (req, res, next) => {
    OK(res, "Login Success !!!", await accessService.login(req.body));
  };
  signUp = async (req, res, next) => {
    CREATED(res, "Register Success!!!", await accessService.signUp(req.body));
  };
}

module.exports = new AccessController();
