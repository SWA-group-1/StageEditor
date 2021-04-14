function integer_restriction(element, min, max, callback) {
  return function () {
    let raw = element.value;

    let number = Math.round(raw);
    number = Math.max(min, Math.min(max, number));
    element.value = number;

    callback();
  }
}

window.addEventListener("load", function () {
  const number_element = document.querySelectorAll("#number")[0];
  number_element.addEventListener("change", integer_restriction(number_element, 0, 999, update_json));

  const name_element = document.querySelectorAll("#name")[0];
  name_element.addEventListener("change", function () {
    update_json();
  })

  const column_number_element = document.querySelectorAll("#column_number")[0];
  column_number_element.addEventListener(
      "change",
      integer_restriction(column_number_element, 1, 255, update),
  );

  const row_number_element = document.querySelectorAll("#row_number")[0];
  row_number_element.addEventListener(
      "change",
      integer_restriction(row_number_element, 1, 255, update),
  );
});