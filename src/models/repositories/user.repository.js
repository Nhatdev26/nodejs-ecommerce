"use strict";

const userModel = require("../../models/user.model");

const findById = async ({
  userId,
  select = {
    usr_email: 1,
    usr_password: 1,
    usr_phone: 1,
    usr_id: 1,
    usr_salt: 1,
  },
}) => {
  return userModel.findOne({ usr_id: userId }).select(select).lean();
};

const createUser = async ({
  usr_name,
  usr_slug,
  usr_email,
  usr_password,
  usr_role = null,
  usr_salt,
}) => {
  const user = await userModel.create({
    usr_name,
    usr_slug,
    usr_email,
    usr_password,
    usr_role,
    usr_salt,
  });
  return user;
};

module.exports = { findById, createUser };
