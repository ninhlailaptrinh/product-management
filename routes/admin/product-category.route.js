const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/product-category.controller');
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');
const multer = require('multer');
const upload = multer();
const validate = require('../../validate/admin/product/product-category.validate');

// Định nghĩa routes
router.get('/', controller.index);

router.get('/create', controller.create);

router.post('/create', upload.single('thumbnail'), uploadCloud, validate.createPost, controller.createPost);

router.delete('/delete/:id', controller.deleteItem);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.get('/detail/:id', controller.detail);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id', upload.single('thumbnail'), validate.createPost, controller.editPatch);

module.exports = router;
