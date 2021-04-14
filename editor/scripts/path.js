let reset_path;
let path_points = [];
let update_path;

window.addEventListener("load", function () {
  const column_number_element = document.querySelectorAll("#column_number")[0];
  const near_square = 80;
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
  let tile_width;
  let tile_height;

  function create_path_point(x, y) {
    return { x: x, y: y}
  }
  reset_path = function () {
    path_points = [];
    update_path();
  };
  function get_near_point(point) {
    let best_distance_square = Infinity;
    let best_index = -1;
    for (let i = 0; i < path_points.length; i++) {
      let delta_x = (point.x - path_points[i].x) * tile_width;
      let delta_y = (point.y - path_points[i].y) * tile_height;
      let distance_square = delta_x * delta_x + delta_y * delta_y;
      if (distance_square < best_distance_square) {
        best_distance_square = distance_square;
        best_index = i;
      }
    }

    return best_distance_square < near_square ? best_index : -1;
  }
  function get_tile_point(clientX, clientY) {
    let canvas_rect = path_display_element.getBoundingClientRect()
    let origin_left = canvas_rect.left + path_display_border;
    let origin_bottom = canvas_rect.bottom - path_display_border;

    let click_tile_x = (clientX - origin_left) / tile_width;
    let click_tile_y = -(clientY - origin_bottom) / tile_height;
    return create_path_point(click_tile_x, click_tile_y);
  }
  function path_resize_window() {
    let column_number = column_number_element.value;
    let row_number = row_number_element.value;

    let canvas_rect = path_display_element.getBoundingClientRect()
    tile_width = (canvas_rect.width - 2 * path_display_border) / column_number;
    tile_height = (canvas_rect.height - 2 * path_display_border) / row_number;
  }
  update_path = function () {
    let canvas_rect = path_display_element.getBoundingClientRect()
    path_display_element.height = canvas_rect.height;
    path_display_element.width = canvas_rect.width;
    path_resize_window();

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
    let tile_point = get_tile_point(event.clientX, event.clientY);
    let near_point_index = get_near_point(tile_point);
    if (near_point_index === -1) {
      path_points.push(tile_point);
    } else {
      path_points.splice(near_point_index, 1);
    }

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