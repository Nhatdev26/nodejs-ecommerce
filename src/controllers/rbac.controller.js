"use strict";

const { CREATED, OK } = require("../core/success.response");
const RbacService = require("../services/rbac.service");

class RbacController {
  createResource = async (req, res, next) => {
    CREATED(
      res,
      "Create Resource success",
      await RbacService.createResource(req.body)
    );
  };

  getListResource = async (req, res, next) => {
    OK(res, "Get list resource success", await RbacService.getListResource());
  };
  createRole = async (req, res, next) => {
    CREATED(res, "Create Role Success", await RbacService.createRole(req.body));
  };
  getListRole = async (req, res, next) => {
    OK(
      res,
      "Get List Role Success",
      await RbacService.getListRole({
        userId: req.user._id,
      })
    );
  };
}

module.exports = new RbacController();
