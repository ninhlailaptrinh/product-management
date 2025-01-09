module.exports = (query) => {
  const objectSearch = {
    keyword: "",
    regex: null, // Khởi tạo regex là null
  };

  // Kiểm tra và xử lý từ khóa tìm kiếm
  if (query.keyword?.trim()) {
    objectSearch.keyword = query.keyword.trim();
    objectSearch.regex = new RegExp(objectSearch.keyword, "i"); // Tìm kiếm không phân biệt chữ hoa thường
  }

  return objectSearch;
};
