const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const roleSchema = new mongoose.Schema(
  {
    permissions: {
      type: Array,
      default: [],
    },
    title: String,
    product_category_id: {
      type: String,
      default: '',
    },
    description: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);

const Role = mongoose.model('Role', roleSchema, 'roles');

module.exports = Role;
