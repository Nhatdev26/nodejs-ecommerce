"use strict";

const { BadRequestError } = require("../core/error.response");
const { ClothingFactory } = require("../factories/products/clothing.factory");
const {
  ElectronicFactory,
} = require("../factories/products/electronic.factory");
const { FurnitureFactory } = require("../factories/products/furniture.factory");
const {
  findAllDraftForShop,
  findAllPublishedForShop,
  publishedByShop,
  unPublishedByShop,
} = require("../models/repositories/product.repository");

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

  // cách 2 :
  // create new Product

  static productRegistry = {}; // key-class

  // create new Product
  static createProduct(type, payload) {
    const productClass = ProductService.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError("Invalid product type:: ", type);
    }
    return new productClass(payload).createProduct();
  }

  // PUT //

  // published product
  static async publishedProductByShop({ product_shop, product_id }) {
    return await publishedByShop({ product_shop, product_id });
  }

  static async unPublishedProductByShop({ product_shop, product_id }) {
    return await unPublishedByShop({ product_shop, product_id });
  }

  // query product //

  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }

  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishedForShop({ query, limit, skip });
  }
}

// register product type
ProductService.productRegistry["Clothings"] = ClothingFactory;
ProductService.productRegistry["Electronics"] = ElectronicFactory;
ProductService.productRegistry["Furniture"] = FurnitureFactory;

module.exports = { ProductService };
