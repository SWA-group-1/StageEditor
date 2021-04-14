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
  function end_drag() {
    if (dragging_info) {
      dragging_info = null;

      update_path();
      update_json();
    }
  }
  function get_square_distance(first, second) {
    let delta_x = (first.x - second.x) * tile_width;
    let delta_y = (first.y - second.y) * tile_height;
    return delta_x * delta_x + delta_y * delta_y;
  }
  function get_dragging_info(index) {
    return {
      index: index,
    };
  }
  function get_near_point(point) {
    let best_square_distance = Infinity;
    let best_index = -1;
    for (let i = 0; i < path_points.length; i++) {
      let square_distance = get_square_distance(point, path_points[i]);
      if (square_distance < best_square_distance) {
        best_square_distance = square_distance;
        best_index = i;
      }
    }

    return {
      square_distance: best_square_distance,
      index: best_index,
    };
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

  path_display_element.addEventListener("mousedown", function (event) {
    path_resize_window();
    let tile_point = get_tile_point(event.clientX, event.clientY);

    if (path_points.length === 0) {
      path_points.push(tile_point);
      dragging_info = get_dragging_info(0);
      update_path();
      return;
    }

    let near_point = get_near_point(tile_point);
    if (near_point.square_distance < near_square) {
      path_points.splice(near_point.index, 1);
      update_path();
      update_json();
      return;
    }

    // Find neighbors.
    let lower, upper;
    if (0 < near_point.index) {
      lower = path_points[near_point.index - 1];
    }
    if (near_point.index < path_points.length - 1) {
      upper = path_points[near_point.index + 1];
    }

    // Different things depending on neighbors
    if (lower) {
      if (upper) {
        // In the path
        let sd = get_square_distance
        let near = path_points[near_point.index];
        let normalized_lower = (sd(lower, tile_point) + sd(tile_point, near)) / sd(lower, near);
        let normalized_upper =  (sd(near, tile_point) + sd(tile_point, upper)) / sd(near, upper);
        if (normalized_lower < normalized_upper) {
          path_points.splice(near_point.index, 0, tile_point);
          dragging_info = get_dragging_info(near_point.index);
        } else {
          path_points.splice(near_point.index + 1, 0, tile_point);
          dragging_info = get_dragging_info(near_point.index + 1);
        }
      } else {
        // Tail
        path_points.push(tile_point);
        dragging_info = get_dragging_info(near_point.index + 1);
      }
    } else {
      if (upper) {
        // Head
        path_points.splice(0, 0, tile_point);
        dragging_info = get_dragging_info(0);
      } else {
        // Single point
        path_points.push(tile_point);
        dragging_info = get_dragging_info(1);
      }
    }
    update_path();
  });
  path_display_element.addEventListener("mousemove", function(event) {
    if (dragging_info) {
      path_points[dragging_info.index] = get_tile_point(event.clientX, event.clientY);
      update_path();
    }
  });
  path_display_element.addEventListener("mouseup", end_drag);
  path_display_element.addEventListener("mouseleave", end_drag);
});