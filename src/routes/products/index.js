"use strict";
const express = require("express");
const router = express.Router();
const productController = require("../../controllers/product.controller");

const { asyncHandler } = require("../../helpers/async.handle");
const { authentication } = require("../../auth/authUtils");

router.use(authentication);
router.post("/", asyncHandler(productController.createProduct));
router.post(
  "/publish/:id",
  asyncHandler(productController.publishedProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unPublishedProductByShop)
);

// query product //

router.get("/drafts/all", asyncHandler(productController.getAllDraftProduct));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishedProduct)
);

module.exports = router;
