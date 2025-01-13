const ProductCategory = require("../../models/product-category.model");
// const filterStatusHelper = require("../../helpers/filterStatus");
// const searchHelper = require("../../helpers/search");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const products = await ProductCategory.find(find);

  res.render("admin/pages/product-category/index", {
    pageTitle: "Danh mục sản phẩm",
    products: products,
  });
};

module.exports.create = async (req, res) => {
  res.render("admin/pages/product-category/create", {
    pageTitle: "Tạo mục sản phẩm",
  });
};

// Xử lý tạo sản phẩm
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const countProducts = await ProductCategory.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position, 10);
  }

  const product = new ProductCategory(req.body);
  await product.save();
  console.log(req.body);

  res.redirect(`${systemConfig.prefixAdmin}/product-category`);
};
