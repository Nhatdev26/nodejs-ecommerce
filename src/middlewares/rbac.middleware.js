"use strict";

const AccessControl = require("accesscontrol");
const rbac = new AccessControl();
const { AuthFailureError, ForbiddenError } = require("../core/error.response");
const { getListRole } = require("../services/rbac.service");
/**
 *
 * @param {*} action // read, delete, update
 * @param {*} resource // profile , balance
 */

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      rbac.setGrants(await getListRole({ userId: req.userId }));
      const roles = req.user.roles;
      let isAction = false;
      for (const roleName in roles) {
        const permission = rbac.can(roleName)[action][resource];
        if (permission.granted) {
          isAction = true;
          break;
        }
      }
      if (!isAction) {
        throw new ForbiddenError("Permission deny");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

const checkAdmin = async (req, res, next) => {
  if (req.user.role !== admin) {
    throw new ForbiddenError("Admin access only ...");
  }
  next();
};

module.exports = { grantAccess, checkAdmin };
