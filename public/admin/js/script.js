// Button status
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
  buttonStatus.forEach((button) => {
    let url = new URL(location.href);
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      location.href = url.href;
    });
  });
}

// Form search

const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault(); // không reload trang khi bấm nút tìm

    const keyword = e.target.elements.keyword.value.trim();

    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    location.href = url.href;
  });
}

// checkbox all
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  // Lấy checkbox "Chọn tất cả"
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  // Lấy tất cả các checkbox có name="id"
  const inputIds = checkboxMulti.querySelectorAll("input[name='id']");

  // Xử lý sự kiện khi click vào checkbox "Chọn tất cả"
  inputCheckAll.addEventListener("click", () => {
    // Duyệt qua từng checkbox và đặt trạng thái của chúng giống với checkbox "Chọn tất cả"
    inputIds.forEach((input) => {
      input.checked = inputCheckAll.checked;
    });
  });

  // Xử lý sự kiện khi click vào từng checkbox
  inputIds.forEach((input) => {
    input.addEventListener("click", () => {
      // Đếm số lượng checkbox đã được chọn
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked",
      ).length;

      // Nếu tất cả các checkbox đều được chọn, đánh dấu checkbox "Chọn tất cả"
      if (countChecked === inputIds.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}

// Form change multi

const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();

    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked",
    );

    const typeChange = e.target.elements.type.value;
    if (typeChange == "delete-all") {
      const isConfirm = confirm("Yess ??");
      if (!isConfirm) {
        return;
      }
    }

    if (inputChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputChecked.forEach((input) => {
        const id = input.value;

        if (typeChange == "change-position") {
          const position = input
            .closest("tr")
            .querySelector("input[name='position']").value;
          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });

      inputIds.value = ids.join(", ");
      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất 1 sản phẩm!");
    }
  });
}

// Show alert
const showAlert = document.querySelectorAll("[show-alert]");
if (showAlert.length > 0) {
  showAlert.forEach((alert) => {
    const time = parseInt(alert.getAttribute("data-time"));
    setTimeout(() => {
      alert.classList.add("alert-hidden");
    }, time);

    setTimeout(() => {
      alert.remove();
    }, time + 1000);
  });
}

// click close alert

const closeAlert = document.querySelectorAll("[close-alert]");
if (closeAlert.length > 0) {
  closeAlert.forEach((alert) => {
    alert.addEventListener("click", () => {
      alert.closest(".alert").remove();
    });
  });
}

// previewImage
var uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  var uploadImageInput = document.querySelector("[upload-image-input]");

  var uploadImagePreview = document.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
      uploadImagePreview.style.display = "block";
    }
  });
}

// click delete images
const clearImagePreview = document.querySelector(".image-preview");
if (clearImagePreview) {
  clearImagePreview.addEventListener("click", () => {
    uploadImagePreview.src = "";
    uploadImageInput.value = "";
    uploadImagePreview.style.display = "none";
  });
}
