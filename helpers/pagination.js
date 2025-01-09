module.exports = (objectPagination, query, countProducts) => {
  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  } else {
    objectPagination.currentPage = 1;
  }

  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItem;

  // Tính số trang
  objectPagination.totalPage = Math.ceil(
    countProducts / objectPagination.limitItem,
  );

  return objectPagination;
};
