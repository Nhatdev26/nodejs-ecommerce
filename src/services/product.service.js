"use strict";

const { BadRequestError } = require("../core/error.response");
const { ClothingFactory } = require("../factories/products/clothing.factory");
const {
  ElectronicFactory,
} = require("../factories/products/electronic.factory");
const { FurnitureFactory } = require("../factories/products/furniture.factory");

class ProductService {
  // cách 1
  // static async createProduct(type, payload) {
  //   switch (type) {
  //     case "Clothings":
  //       return await new ClothingFactory(payload).createProduct();
  //     case "Electronics":
  //       return await new ElectronicFactory(payload).createProduct();
  //     case "Furniture":
  //       return await new FurnitureFactory(payload).createProduct();
  //     default:
  //       throw new BadRequestError("Invalid product type:: ", type);
  //   }
  // }

  // cách 2
  static productRegistry = {}; // key-class
  static createProduct(type, payload) {
    const productClass = ProductService.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError("Invalid product type:: ", type);
    }
    return new productClass(payload).createProduct();
  }
}

// register product type
ProductService.productRegistry["Clothings"] = ClothingFactory;
ProductService.productRegistry["Electronics"] = ElectronicFactory;
ProductService.productRegistry["Furniture"] = FurnitureFactory;

module.exports = { ProductService };
