const { BadRequestError } = require("../../core/error.response");
const { electronic } = require("../../models/product.model");
const { ProductFactory } = require("./product.factory");

class ElectronicFactory extends ProductFactory {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) {
      throw new BadRequestError("Failed to create new electronic");
    }

    // create new Product
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("Failed to create new product");
    }
    return newProduct;
  }
}

module.exports = { ElectronicFactory };
