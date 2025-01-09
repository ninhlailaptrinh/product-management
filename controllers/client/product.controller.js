const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active", // Chỉ lấy các sản phẩm có trạng thái active
    deleted: "false", // Chỉ lấy các sản phẩm chưa bị xóa
  }).sort({ position: "desc" });

  const newProducts = products.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0);
    return item;
  });

  res.render("client/pages/products/index", {
    pageTitle: "Trang danh sách sản phẩm",
    products: newProducts,
  });
};

// Trang chi tiết sản phẩm
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: "false",
      slug: req.params.slug,
      status: "active",
    };

    const product = await Product.findOne(find);

    res.render("client/pages/products/detail", {
      pageTitle: "Thông tin sản phẩm",
      product: product,
    });
  } catch (error) {
    res.redirect(`/products`, error);
  }
};
