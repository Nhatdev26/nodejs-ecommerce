const { BadRequestError } = require("../../core/error.response");
const { clothing } = require("../../models/product.model");
const { ProductFactory } = require("./product.factory");

class ClothingFactory extends ProductFactory {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    console.log(newClothing);
    if (!newClothing) {
      throw new BadRequestError("Failed to create new clothing");
    }

    // create new Product
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError("Failed to create new product");
    }
    return newProduct;
  }
}

module.exports = { ClothingFactory };
