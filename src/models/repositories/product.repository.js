const { update } = require("lodash");
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../product.model");
const { Types } = require("mongoose");

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishedForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const publishedByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) {
    return null;
  }

  // update isDraft, isPublished
  foundShop.isDraft = false;
  foundShop.isPublished = true;

  const updatedProduct = foundShop.save();
  return updatedProduct ? 1 : 0;
};

const unPublishedByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) {
    return null;
  }

  // update isDraft, isPublished
  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const updatedProduct = foundShop.save();
  return updatedProduct ? 1 : 0;
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id") // chỉ lấy name và email của shop, không lấy _id
    .sort({ updateAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();
};

module.exports = {
  findAllDraftForShop,
  findAllPublishedForShop,
  publishedByShop,
  unPublishedByShop,
};
