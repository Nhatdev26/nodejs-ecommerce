const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "KeyToken";
const COLLECTION_NAME = "KeyTokens";

const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      trim: true,
      ref: "Shop",
    },
    publicKey: {
      type: String,
      trim: true,
    },
    privateKey: {
      type: String,
      trim: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
