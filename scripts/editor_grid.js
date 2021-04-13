function add_grid_listeners() {
    document.querySelector("#column_number").addEventListener("change", update_grid);
    document.querySelector("#row_number").addEventListener("change", update_grid);

    let grid_element = document.querySelector("#grid");
    grid_element.clicked = false;
    grid_element.addEventListener("mousedown", function (event) {
        if (!event.target.classList.contains("tile")) {
            return;
        }

        grid_element.clicked = !grid_element.clicked;
        grid_element.paint_blocked = !event.target.classList.contains("blocked");
    });
}

function color_tile(grid_element, tile_element) {
    if (grid_element.clicked) {
        console.log(tile_element);
        if (grid_element.paint_blocked) {
            tile_element.classList.add("blocked");
        } else {
            tile_element.classList.remove("blocked");
        }
    }
}

function update_grid() {
    // Extract and fix input values
    let column_number_element = document.querySelector("#column_number");
    let column_number = Math.round(column_number_element.value);
    column_number_element.value = column_number;

    let row_number_element = document.querySelector("#row_number");
    let row_number = Math.round(row_number_element.value);
    row_number_element.value = row_number;

    let grid_element = document.querySelectorAll("#grid")[0];

    while (grid_element.firstChild) {
        grid_element.removeChild(grid_element.firstChild);
    }

    let tiles = [];
    for (let row = 0; row < row_number; row++) {
        let row_element = document.createElement("div");
        row_element.classList.add("row");

        for (let column = 0; column < column_number; column++) {
            let tile_element = document.createElement("div");
            tile_element.classList.add("tile");
            tile_element.addEventListener("mouseenter", function (event) {
                color_tile(grid_element, event.target)
            });
            color_tile(grid_element, tile_element);
            tiles.push(tile_element);

            row_element.appendChild(tile_element);
        }

        grid_element.appendChild(row_element);
    }
    grid_element.tiles = tiles;
}

window.addEventListener("load", add_grid_listeners);