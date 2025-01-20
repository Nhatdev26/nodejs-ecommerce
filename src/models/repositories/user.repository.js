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

module.exports = { findById };
