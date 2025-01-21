// Xử lý sự kiện click
const tablePermission = document.querySelector('#table-permission');
const buttonSubmit = document.querySelector('button[button-submit]');

buttonSubmit.addEventListener('click', () => {
  let permission = [];

  const rows = tablePermission.querySelectorAll('tr[data-name]');

  rows.forEach((row) => {
    const name = row.getAttribute('data-name');
    const inputs = row.querySelectorAll('input');

    if (name === 'id') {
      inputs.forEach((input) => {
        const id = input.value;
        permission.push({
          id: id,
          permission: [],
        });
      });
    } else {
      inputs.forEach((input, index) => {
        if (input.checked) {
          permission[index].permission.push(name);
        }
      });
    }
  });

  const formChangePermission = document.querySelector('form.form-change-permission');
  const inputPermission = formChangePermission.querySelector("input[name='permission']");
  inputPermission.value = JSON.stringify(permission);
  formChangePermission.submit();
});

// Hiển thị checkbox
const dataRoles = document.querySelector('[data-roles]');
const roles = JSON.parse(dataRoles.getAttribute('data-roles'));

roles.forEach((role, index) => {
  role.permissions.forEach((permission) => {
    const row = tablePermission.querySelector(`tr[data-name="${permission}"]`);
    const input = row.querySelectorAll('input')[index];
    input.checked = true;
  });
});
