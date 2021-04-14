let reset_path;
let path_points = [];
let update_path;

window.addEventListener("load", function () {
  const column_number_element = document.querySelectorAll("#column_number")[0];
  const row_number_element = document.querySelectorAll("#row_number")[0];
  const path_display_border = 100;
  const path_display_element = document.querySelectorAll("#path_display")[0];
  const path_color = "#FAFAFA";
  const path_point_color = "#D500F9";
  const path_size = 5;
  const point_size = 7.5;
  const context = path_display_element.getContext("2d");

  let dragging = false;
  let dragging_info = null;
  let column_number;
  let row_number;
  let tile_width;
  let tile_height;

  function create_path_point(x, y) {
    return { x: x, y: y}
  }
  reset_path = function () {
    path_points = [];
    update_path();
  };
  function path_resize_window() {
    column_number = column_number_element.value;
    row_number = row_number_element.value;

    let canvas_rect = path_display_element.getBoundingClientRect()
    tile_width = (canvas_rect.width - 2 * path_display_border) / column_number;
    tile_height = (canvas_rect.height - 2 * path_display_border) / row_number;
  }
  path_resize_window();
  update_path = function () {
    let canvas_rect = path_display_element.getBoundingClientRect()
    path_display_element.height = canvas_rect.height;
    path_display_element.width = canvas_rect.width;

    context.lineWidth = path_size;
    context.strokeStyle = path_color;
    for (let i = 1; i < path_points.length; i++) {
      context.beginPath();
      context.moveTo(
        path_points[i - 1].x * tile_width + 100,
        canvas_rect.height - path_points[i - 1].y * tile_height - 100
      );
      context.lineTo(
        path_points[i].x * tile_width + 100,
        canvas_rect.height - path_points[i].y * tile_height - 100
      );
      context.stroke();
    }

    context.fillStyle = path_point_color;
    for (let i = 0; i < path_points.length; i++) {
      context.beginPath();
      context.arc(
        path_points[i].x * tile_width + 100,
        canvas_rect.height - path_points[i].y * tile_height - 100,
        point_size, 0, 2 * Math.PI);
      context.fill();
    }
  };

  path_display_element.addEventListener("click", function (event) {
    let canvas_rect = path_display_element.getBoundingClientRect()
    let origin_left = canvas_rect.left + path_display_border;
    let origin_bottom = canvas_rect.bottom - path_display_border;

    let click_tile_x = (event.clientX - origin_left) / tile_width;
    let click_tile_y = -(event.clientY - origin_bottom) / tile_height;
    path_points.push(create_path_point(click_tile_x, click_tile_y));
    update_path();
    update_json();
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