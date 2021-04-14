function update_json() {
  let grid_element = document.querySelectorAll("#grid")[0];
  let stage_json_element = document.querySelectorAll("#stage_json")[0];
  let column_number = Math.round(document.querySelectorAll("#column_number")[0].value);
  let row_number = Math.round(document.querySelectorAll("#row_number")[0].value);

  let text = `{\n`;

  text += `\t"Number": ${Math.round(document.querySelectorAll("#number")[0].value)},\n`;
  text += `\t"Name": "${document.querySelectorAll("#name")[0].value}",\n`;
  text += `\t"XSize": ${column_number},\n`;
  text += `\t"YSize": ${row_number},\n`;

  text += `\t"BlockedTiles": [\n`;
  let tiles = grid_element.tiles;
  let contains_blocked_tiles = false;
  for (let i = 0; i < tiles.length; i++) {
    if (!tiles[i].classList.contains("blocked")) {
      continue;
    }

    contains_blocked_tiles = true;
    let x = i % column_number;
    let y = (i - x) / column_number;
    text += `\t\t{ "X": ${Math.round(x)}, "Y": ${Math.round(y)} },\n`;
  }
  if (contains_blocked_tiles) {
    text = text.slice(0, -2) + "\n";
  }
  text += `\t],\n`;

  text += `\t"PathPoints": [\n`;
  let contains_path_points = false;
  for (let i = 0; i < path_points.length; i++) {
    contains_path_points = true;
    text += `\t\t{ "X": ${path_points[i].x}, "Y": ${path_points[i].y} },\n`
  }
  if (contains_path_points) {
    text = text.slice(0, -2) + "\n";
  }
  text += `\t]\n`;

  text += `}`;

  stage_json_element.innerText = text;
}