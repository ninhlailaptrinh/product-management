const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    thumbnail: String,
    stock: Number,
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

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
