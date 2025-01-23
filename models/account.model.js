const mongoose = require('mongoose');
const generate = require('../helpers/generate');
const accountSchema = new mongoose.Schema(
  {
    fullname: String,
    password: String,
    phone: String,
    email: String,
    avatar: String,
    token: {
      type: String,
      default: generate.generateString(30),
    },
    role_id: String,
    status: String,
    deleteAt: Date,
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model('Account', accountSchema, 'accounts');

module.exports = Product;
