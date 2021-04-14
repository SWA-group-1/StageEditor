window.addEventListener("load", function () {
  const mode_input_element = document.querySelectorAll("#brush_mode")[0];
  const grid_element = document.querySelectorAll("#grid")[0];
  const default_grid_display = grid_element.style.display;
  const path_display_element = document.querySelectorAll("#path_display")[0];
  const default_path_display_display = path_display_element.style.display;

  const update_mode = function () {
    if (mode_input_element.value === mode_input_element.options[0].value) {
      // Blocked tiles mode

      grid_element.style.display = default_grid_display;
      path_display_element.style.display = "none";
    } else if (mode_input_element.value === mode_input_element.options[1].value) {
      // Path points mode

      grid_element.style.display = "none";
      path_display_element.style.display = default_path_display_display;
    }
  };
  update_mode();

  mode_input_element.addEventListener("change", update_mode);
});