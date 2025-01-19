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
