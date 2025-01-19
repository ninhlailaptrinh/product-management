const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
require("dotenv").config();
// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Hàm xử lý upload ảnh
const uploadImage = async (req, res, next) => {
  if (req.file) {
    try {
      // Tạo stream từ buffer và upload lên Cloudinary
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      // Upload ảnh và lưu URL vào req.body
      const result = await streamUpload(req);
      console.log("Upload result:", result);

      if (!result || !result.secure_url) {
        return res.status(500).json({ error: "Upload failed" });
      }

      // Lưu URL ảnh vào req.body
      req.body.thumbnail = result.secure_url;

      // ok next  Chuyển sang middleware tiếp theo
      next();
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).send("Upload failed");
    }
  } else {
    next();
  }
};

// Export trực tiếp hàm uploadImage
module.exports = uploadImage;
