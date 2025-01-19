const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');

module.exports.index = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  res.render('admin/pages/roles/index', {
    pageTitle: 'Danh sách nhóm quyền',
    roles: roles,
  });
};

// create
module.exports.create = async (req, res) => {
  res.render('admin/pages/roles/create', {
    pageTitle: 'Thêm mới nhóm quyền',
    prefixAdmin: systemConfig.prefixAdmin,
  });
};

module.exports.createPost = async (req, res) => {
  const role = new Role(req.body);
  role.status = 'active';
  await role.save();

  req.flash('success', 'Thêm nhóm quyền thành công!');
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};
// edit

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      _id: id,
      deleted: false,
    };

    const roles = await Role.findOne(find);
    res.render('admin/pages/roles/edit', {
      pageTitle: 'Sửa nhóm quyền',
      roles: roles,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`, error);
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, req.body);
    req.flash('success', 'Cập nhật nhóm quyền thành công!');
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    console.error('Edit error:', error);
    req.flash('error', 'Cập nhật nhóm quyền thất bại!');
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};
// chi tiết nhóm quyền
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const roles = await Role.findOne(find);

    res.render('admin/pages/roles/detail', {
      pageTitle: 'Thông tin nhóm quyền',
      roles: roles,
    });
  } catch (error) {
    req.flash('error', 'Lỗi khi tải trang chi tiết nhóm quyền!');
    res.redirect(`${systemConfig.prefixAdmin}/roles`, error);
  }
};

// Delete nhm quyen
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('Deleting role with ID:', id);

    await Role.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date(),
      },
    );

    req.flash('success', 'Xóa nhóm quyền thành công');
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    console.error('Delete error:', error);
    req.flash('error', 'Xóa nhóm quyền thất bại!');
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};
