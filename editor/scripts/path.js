let reset_path;
let path_points = [];

window.addEventListener("load", function () {
  const column_number_element = document.querySelectorAll("#column_number")[0];
  const row_number_element = document.querySelectorAll("#row_number")[0];
  const path_display_border = 100;
  const path_display_element = document.querySelectorAll("#path_display")[0];

  let dragging = false;
  let dragging_info = null;

  function create_path_point(x, y) {
    return { x: x, y: y}
  }
  reset_path = function () {
    path_points = [];
  };

  path_display_element.addEventListener("click", function (event) {
    let canvas_rect = path_display_element.getBoundingClientRect()
    let origin_left = canvas_rect.left + path_display_border;
    let origin_bottom = canvas_rect.bottom - path_display_border;

    let column_number = column_number_element.value;
    let row_number = row_number_element.value;

    let tile_width = (canvas_rect.width - 2 * path_display_border) / column_number;
    let tile_height = (canvas_rect.height - 2 * path_display_border) / row_number;
    let click_tile_x = (event.clientX - origin_left) / tile_width;
    let click_tile_y = -(event.clientY - origin_bottom) / tile_height;
    path_points.push(create_path_point(click_tile_x, click_tile_y));
    console.log(path_points);
  });
  path_display_element.addEventListener("mouseleave", function () {
    dragging = false;
    dragging_info = null;
  });
  path_display_element.addEventListener("mouseup", function () {
    dragging = false;
    dragging_info = null;
  });
});