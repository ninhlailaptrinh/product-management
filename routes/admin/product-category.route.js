const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/product-category.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const multer = require("multer");
const upload = multer();
const validate = require("../../validate/admin/product/product-category.validate");

// Định nghĩa routes
router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud,
  validate.createPost,
  controller.createPost,
);

module.exports = router;
