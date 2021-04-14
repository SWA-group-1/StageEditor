function add_image_file_change_listener() {
  let button_element = document.querySelectorAll("#image_file")[0];
  button_element.addEventListener("change", change_image);
}

function change_image() {
  let image_file_element = document.querySelectorAll("#image_file")[0];
  if (!image_file_element.files || !image_file_element.files[0]) {
    return;
  }

  let reader = new FileReader();
  reader.readAsDataURL(image_file_element.files[0]);

  reader.addEventListener("load", function () {
    let grid_background_element = document.querySelectorAll("#grid_background")[0];
    grid_background_element.src = reader.result;
    grid_background_element.style.opacity = "1.0";
    grid_background_element.style.padding = "0";
    update_path();
  });
}

window.addEventListener("load", add_image_file_change_listener);