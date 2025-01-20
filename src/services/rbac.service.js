"use strict";

const { ConflictRequestError } = require("../core/error.response");
const { checkAdmin } = require("../middlewares/rbac.middleware");
const { findById } = require("../models/repositories/user.repository");
const resourceModel = require("../models/resource.model");
const roleModel = require("../models/role.model");

class RbacService {
  static createResource = async ({ name, slug, description }) => {
    //1. check name or slug exists
    const foundResource = await resourceModel.findOne({
      $or: [{ src_name: name }, { src_slug: slug }],
    });

    if (foundResource) {
      throw new ConflictRequestError("Resource already existed");
    }

    //2. create new resource
    const resource = await resourceModel.create({
      src_name: name,
      src_slug: slug,
      src_description: description,
    });

    return resource;
  };

  static getListResource = async (
    userId = "",
    limit = 30,
    offset = 0,
    search = ""
  ) => {
    // check admin ? middleware func

    // get lists of resource

    return await resourceModel.aggregate([
      {
        $project: {
          _id: 0,
          name: "$src_name",
          slug: "$src_slug",
          description: "$src_description",
          resourceId: "$_id",
          createdAt: 1,
        },
      },
    ]);
  };

  static createRole = async ({ name, slug, description = "", grants = [] }) => {
    //1 check role exists
    const foundRole = await roleModel.findOne({
      $or: [{ rol_name: name }, { rol_slug: slug }],
    });
    if (foundRole) {
      throw new ConflictRequestError("Role already existed");
    }

    // create new Role
    const newRole = await roleModel.create({
      rol_name: name,
      rol_slug: slug,
      rol_description: description,
      rol_grant: grants,
    });

    return newRole;
  };

  static getListRole = async ({ userId = 0 }) => {
    try {
      // get role of user
      const foundUser = await findById({ userId });

      const roleCodes = foundUser.usr_role;

      // get roles detail

      const roles = await roleModel.aggregate([
        {
          $match: {
            _id: { $in: roleCodes },
          },
        },
        {
          $unwind: "$rol_grant",
        },
        {
          $lookup: {
            from: "Resources",
            localField: "rol_grant.resource",
            foreignField: "_id",
            as: "resource",
          },
        },
        {
          $unwind: "$resource",
        },
        {
          $project: {
            role: "$rol_name",
            resource: "$resource.src_name",
            action: "$rol_grant.action",
            attributes: "$rol_grant.attributes",
          },
        },
        {
          $unwind: "$action",
        },
        {
          $project: {
            _id: 0,
            role: 1,
            resource: 1,
            action: 1,
            attributes: 1,
          },
        },
      ]);

      return roles;
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = RbacService;
