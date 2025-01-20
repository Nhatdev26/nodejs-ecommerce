const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Role";
const COLLECTION_NAME = "Roles";

const roleSchema = new Schema(
  {
    rol_name: {
      type: String,
      default: "user",
      enum: ["user", "admin", "shop"],
    },
    rol_slug: { type: String, require: true },
    rol_status: {
      type: String,
      default: "active",
      enum: ["active", "block", "pending"],
    },
    rol_description: { type: String, default: "" },
    rol_grant: [
      {
        resource: {
          type: Schema.Types.ObjectId,
          ref: "Resource",
          required: true,
        },
        action: [{ type: String, required: true }],
        attributes: { type: String, default: "*" },
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, roleSchema);
