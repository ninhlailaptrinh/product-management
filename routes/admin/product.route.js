const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/product.controller");
const multer = require("multer");
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() });
const validate = require("../../validate/admin/product.validate");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.createItem);

router.post(
  "/create",
  upload.single("thumbnail"),
  validate.creatPost,
  controller.createPost,
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  validate.creatPost,
  controller.editPatch,
);

router.get("/detail/:id", controller.detail);

module.exports = router;
