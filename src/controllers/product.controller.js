"use strict";

const { CREATED } = require("../core/success.response");
const { ProductService } = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    const userId = req.user.userId;
    const result = await ProductService.createProduct(req.body.product_type, {
      ...req.body,
      product_shop: userId,
    });
    CREATED(res, "Create new Product Success", result);
  };
}

module.exports = new ProductController();
