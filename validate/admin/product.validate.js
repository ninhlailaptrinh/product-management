module.exports.creatPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", "Vui lòng nhập tên sản phẩm !");
    return res.redirect(req.get("Referrer") || "/");
  }
  next(); // để đi tiếp =>> midleware
};
