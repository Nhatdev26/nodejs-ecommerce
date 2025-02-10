"use strict";

const { CREATED, OK } = require("../core/success.response");
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

  // query product //

  getAllDraftProduct = async (req, res, next) => {
    const userId = req.user.userId;
    const result = await ProductService.findAllDraftForShop({
      product_shop: userId,
    });
    OK(res, "Get all draft product success", result);
  };
  getAllPublishedProduct = async (req, res, next) => {
    const userId = req.user.userId;
    const result = await ProductService.findAllPublishedForShop({
      product_shop: userId,
    });
    OK(res, "Get all Published product success", result);
  };

  publishedProductByShop = async (req, res, next) => {
    const userId = req.user.userId;
    const result = await ProductService.publishedProductByShop({
      product_shop: userId,
      product_id: req.params.id,
    });
    CREATED(res, " Published product success", result);
  };
  unPublishedProductByShop = async (req, res, next) => {
    const userId = req.user.userId;
    const result = await ProductService.unPublishedProductByShop({
      product_shop: userId,
      product_id: req.params.id,
    });
    CREATED(res, " UnPublished product success", result);
  };
}

module.exports = new ProductController();
