"use strict";

const shopModel = require("../models/shop.model");

class ShopService {
  static findShopByEmail = async ({
    email,
    select = { email: 1, password: 1, status: 1, roles: 1, name: 1 },
  }) => {
    return await shopModel.findOne({ email }).select(select).lean();
  };

  static createShop = async ({ name, email, password }) => {
    return await shopModel.create({
      name,
      email,
      password,
    });
  };
}

module.exports = ShopService;
