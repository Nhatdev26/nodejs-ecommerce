const { BadRequestError } = require("../../core/error.response");
const { furniture } = require("../../models/product.model");
const { ProductFactory } = require("./product.factory");

class FurnitureFactory extends ProductFactory {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newFurniture) {
      throw new BadRequestError("Failed to create new furniture");
    }

    // create new Product
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new BadRequestError("Failed to create new product");
    }
    return newProduct;
  }
}

module.exports = { FurnitureFactory };
