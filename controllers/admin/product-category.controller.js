const ProductCategory = require('../../models/product-category.model');
const filterStatusHelper = require('../../helpers/filterStatus');
const searchHelper = require('../../helpers/search');
const systemConfig = require('../../config/system');
const createTree = require('../../helpers/treeHelper');

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const filterStatus = filterStatusHelper(req.query);

  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  const products = await ProductCategory.find(find);

  const newProducts = createTree(products);

  res.render('admin/pages/product-category/index', {
    pageTitle: 'Danh mục sản phẩm',
    products: newProducts,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    message: req.flash('success'),
    messages: req.flash('error'),
  });
};

module.exports.create = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };

    const products = await ProductCategory.find(find);
    const newProducts = createTree(products);

    res.render('admin/pages/product-category/create', {
      pageTitle: 'Tạo mục sản phẩm',
      products: newProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Đã xảy ra lỗi khi tải trang tạo mục sản phẩm');
  }
};

// Xử lý tạo sản phẩm
module.exports.createPost = async (req, res) => {
  try {
    // Đảm bảo status luôn có giá trị hợp lệ
    if (!['active', 'inactive'].includes(req.body.status)) {
      req.body.status = 'active'; // Mặc định là active
    }

    if (!req.body.position || req.body.position === '') {
      const countCategories = await ProductCategory.countDocuments();
      req.body.position = countCategories + 1;
    } else {
      req.body.position = parseInt(req.body.position, 10);
    }

    if (req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    if (!req.body.title || req.body.title.length < 5) {
      req.flash('error', 'Tên danh mục phải có ít nhất 5 ký tự!');
      return res.redirect(req.get('Referrer') || '/');
    }

    const category = new ProductCategory(req.body);
    await category.save();

    req.flash('success', 'Tạo danh mục thành công!');
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Lỗi khi tạo danh mục!');
    res.redirect(req.get('Referrer') || '/');
  }
};
// Delete item
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // xóa cứng
  // await Product.deleteOne({ _id: id });
  // xóa mềm
  await ProductCategory.updateOne({ _id: id }, { deleted: true, deleteAt: new Date() });
  req.flash('success', 'Xóa sản phẩm thành công');
  res.redirect(req.get('Referrer') || '/');
};

// Router change-status
module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;

    await ProductCategory.updateOne({ _id: id }, { status: status });

    req.flash('success', 'Cập nhật trạng thái thành công!');
    res.redirect(req.get('Referrer') || '/');
  } catch (error) {
    req.flash('error', 'Cập nhật trạng thái thất bại!', error);
    res.redirect(req.get('Referrer') || '/');
  }
};

// Router change-Multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(', ');

  switch (type) {
    case 'active':
      await ProductCategory.updateMany({ _id: { $in: ids } }, { status: 'active' });
      req.flash('success', 'Cập nhật trạng thái thành công');
      break;
    case 'inactive':
      await ProductCategory.updateMany({ _id: { $in: ids } }, { status: 'inactive' });
      req.flash('success', 'Cập nhật trạng thái thành công');
      break;

    case 'delete-all':
      await ProductCategory.updateMany({ _id: { $in: ids } }, { deleted: true, deleteAt: new Date() });
      req.flash('success', 'Xóa sản phẩm thành công');
      break;
    case 'change-position':
      for (const item of ids) {
        let [id, position] = item.split('-');
        position = parseInt(position);
        await ProductCategory.updateOne({ _id: id }, { position: position });
      }
      req.flash('success', 'Cập nhật vị trí thành công');
      break;
    default:
      break;
  }
  res.redirect(req.get('Referrer') || '/');
};

// Trang chi tiết sản phẩm
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const products = await ProductCategory.findOne(find);

    if (!products) {
      return res.redirect(`${systemConfig.prefixAdmin}/product-category`);
    }

    res.render('admin/pages/product-category/detail', {
      pageTitle: 'Thông tin sản phẩm',
      products: products,
    });
  } catch (error) {
    console.error(error);
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  }
};
// module edit
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await ProductCategory.findOne(find);

    if (!product) {
      req.flash('error', 'Không tìm thấy sản phẩm!');
      return res.redirect(`${systemConfig.prefixAdmin}/product-category`);
    }

    res.render('admin/pages/product-category/edit', {
      pageTitle: 'Sửa sản phẩm',
      product: product,
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Lỗi khi tải trang sửa sản phẩm!');
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  }
};
// edit product patch
module.exports.editPatch = async (req, res) => {
  try {
    const productId = req.params.id; // Lấy ID sản phẩm từ URL

    // Kiểm tra tên sản phẩm
    if (!req.body.title || req.body.title.length < 5) {
      req.flash('error', 'Tên sản phẩm phải có ít nhất 5 ký tự!');
      return res.redirect(req.get('Referrer') || '/');
    }

    // Chuyển đổi các trường số
    req.body.price = parseInt(req.body.price, 10);
    req.body.stock = parseInt(req.body.stock, 10);
    req.body.discountPercentage = parseInt(req.body.discountPercentage, 10);
    req.body.position = parseInt(req.body.position, 10);

    if (req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    await ProductCategory.updateOne({ _id: productId }, { $set: req.body });

    req.flash('success', 'Sửa sản phẩm thành công!');
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  } catch (error) {
    req.flash('error', 'Lỗi không thể sửa sản phẩm!', error);
    res.status(500).redirect(req.get('Referrer') || '/');
  }
};
