const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");

// Tách thành các module riêng
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  const productCategories = await ProductCategory.find(find);

  res.render("admin/pages/product-category/index", {
    pageTitle: "Danh mục sản phẩm",
    productCategory: productCategories,
  });
};

module.exports.create = async (req, res) => {
  res.render("admin/pages/product-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
  });
};

module.exports.createPost = async (req, res) => {
  const formData = { ...req.body };

  if (formData.position === "") {
    const countProductCategory = await ProductCategory.countDocuments();
    formData.position = countProductCategory + 1;
  } else {
    formData.position = parseInt(formData.position);
  }

  const productCategory = new ProductCategory(formData);
  await productCategory.save();

  res.redirect(`${systemConfig.prefixAdmin}/product-category`);
};
