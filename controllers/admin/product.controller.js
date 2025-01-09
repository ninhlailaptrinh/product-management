const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const { request } = require("express");
const systemConfig = require("../../config/system");
console.log(request);
module.exports.index = async (req, res) => {
  // Lấy trạng thái lọc từ helper
  const filterStatus = filterStatusHelper(req.query);

  // Điều kiện mặc định để lấy các sản phẩm chưa bị xóa
  let find = {
    deleted: false,
  };

  // Thêm điều kiện lọc theo trạng thái nếu có
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Thêm điều kiện tìm kiếm nếu có
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Đếm tổng số sản phẩm phù hợp với điều kiện tìm kiếm
  const countProducts = await Product.countDocuments(find);

  // Thiết lập phân trang
  const objectPagination = paginationHelper(
    {
      sort: { position: 1 }, // Sắp xếp theo thứ tự tăng dần
      currentPage: 1, // Trang mặc định
      limitItem: 4, // Số sản phẩm mỗi trang
    },
    req.query,
    countProducts,
  );

  // Lấy danh sách sản phẩm với điều kiện tìm kiếm và phân trang
  const products = await Product.find(find)
    .sort({ position: "desc" }) // Sắp xếp theo thứ tự tăng dần
    .skip(objectPagination.skip) // Bỏ qua các sản phẩm trước đó
    .limit(objectPagination.limitItem); // Giới hạn số sản phẩm trên mỗi trang

  // Render trang và truyền dữ liệu
  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm", // Tiêu đề trang
    products: products, // Danh sách sản phẩm
    filterStatus: filterStatus, // Trạng thái lọc
    keyword: objectSearch.keyword, // Từ khóa tìm kiếm
    pagination: objectPagination, // Thông tin phân trang
    message: req.flash("success"),
    messages: req.flash("error"),
  });
};

// Router change-status
module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });

    req.flash("success", "Cập nhật trạng thái thành công!");
    res.redirect(req.get("Referrer") || "/");
  } catch (error) {
    req.flash("error", "Cập nhật trạng thái thất bại!", error);
    res.redirect(req.get("Referrer") || "/");
  }
};

// Router change-Multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash("success", "Cập nhật trạng thái thành công");
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", "Cập nhật trạng thái thành công");
      break;

    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        { deleted: true, deleteAt: new Date() },
      );
      req.flash("success", "Xóa sản phẩm thành công");
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { position: position });
      }
      req.flash("success", "Cập nhật vị trí thành công");
      break;
    default:
      break;
  }
  res.redirect(req.get("Referrer") || "/");
};

// Delete item
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // xóa cứng
  // await Product.deleteOne({ _id: id });
  // xóa mềm
  await Product.updateOne({ _id: id }, { deleted: true, deleteAt: new Date() });
  req.flash("success", "Xóa sản phẩm thành công");
  res.redirect(req.get("Referrer") || "/");
};

// Hiển thị form tạo sản phẩm
module.exports.createItem = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm sản phẩm",
  });
};

// Xử lý tạo sản phẩm
module.exports.createPost = async (req, res) => {
  try {
    // Kiểm tra tên sản phẩm

    // Chuyển đổi các trường số
    req.body.price = parseInt(req.body.price, 10);
    req.body.stock = parseInt(req.body.stock, 10);
    req.body.discountPercentage = parseInt(req.body.discountPercentage, 10);

    // Xác định vị trí (position)
    if (req.body.position == "") {
      const countProducts = await Product.countDocuments();
      req.body.position = countProducts + 1;
    } else {
      req.body.position = parseInt(req.body.position, 10);
    }

    // Xử lý file upload (nếu có)
    if (req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    // Lưu sản phẩm vào database
    const product = new Product(req.body);
    await product.save();

    // Thông báo thành công
    req.flash("success", "Thêm sản phẩm thành công!");
    res.redirect(req.get("Referrer") || `${systemConfig.prefixAdmin}/products`);
  } catch (error) {
    console.error(error);
    req.flash("error", "Lỗi server: Không thể thêm sản phẩm!");
    res.status(500).redirect(req.get("Referrer") || "/");
  }
};

module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: "false",
      _id: req.params.id, //id là duy nhất = 1
    };

    const product = await Product.findOne(find);

    res.render("admin/pages/products/edit", {
      pageTitle: "Thêm sản phẩm",
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`, error);
  }
};
// edit product patch
module.exports.editPatch = async (req, res) => {
  try {
    const productId = req.params.id; // Lấy ID sản phẩm từ URL

    // Kiểm tra tên sản phẩm
    if (!req.body.title || req.body.title.length < 5) {
      req.flash("error", "Tên sản phẩm phải có ít nhất 5 ký tự!");
      return res.redirect(req.get("Referrer") || "/");
    }

    // Chuyển đổi các trường số
    req.body.price = parseInt(req.body.price, 10);
    req.body.stock = parseInt(req.body.stock, 10);
    req.body.discountPercentage = parseInt(req.body.discountPercentage, 10);
    req.body.position = parseInt(req.body.position, 10);

    // Xử lý file upload (nếu có)
    if (req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    // Cập nhật sản phẩm trong database
    await Product.updateOne(
      { _id: productId }, // Điều kiện tìm kiếm
      { $set: req.body }, // Dữ liệu cập nhật
    );

    // Thông báo thành công và chuyển hướng
    req.flash("success", "Sửa sản phẩm thành công!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (error) {
    req.flash("error", "Lỗi không thể sửa sản phẩm!", error);
    res.status(500).redirect(req.get("Referrer") || "/");
  }
};

// Trang chi tiết sản phẩm
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: "false",
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail", {
      pageTitle: "Thông tin sản phẩm",
      product: product,
    });
    console.log(find);
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`, error);
  }
};
