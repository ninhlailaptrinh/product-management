module.exports = (query) => {
  const filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: "",
    },
  ];

  // Kiểm tra và đánh dấu trạng thái hiện tại
  const currentStatus = query.status || ""; // Nếu không có trạng thái, mặc định là "Tất cả"
  const activeItem = filterStatus.find((item) => item.status === currentStatus);
  if (activeItem) {
    activeItem.class = "active";
  }

  return filterStatus;
};
