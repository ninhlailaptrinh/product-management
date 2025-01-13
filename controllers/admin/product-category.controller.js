module.exports = {
  // Trang danh sách danh mục sản phẩm
  index: async (req, res) => {
    res.render("admin/pages/product-category/index", {
      pageTitle: "Danh mục sản phẩm",
    });
  },

  // Trang tạo danh mục sản phẩm
  create: async (req, res) => {
    res.render("admin/pages/product-category/create", {
      pageTitle: "Tạo danh mục sản phẩm",
    });
  },
};
