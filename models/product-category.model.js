const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema(
  {
    parent_id: {
      type: String,
      default: "",
    },
    title: String,
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: { type: String, slug: "title", unique: true }, // unique: true => slug không được trùng
    deleted: {
      type: Boolean,
      default: false,
    },
    deleteAt: Date,
  },
  {
    timestamps: true,
  },
);

// // Tạo index cho trường slug
// productCategorySchema.index({ slug: 1 }, { unique: true });

const ProductCategory = mongoose.model(
  "ProductCategory", // Tên model
  productCategorySchema,
  "products-category", // Tên collection trong MongoDB
);

module.exports = ProductCategory;
