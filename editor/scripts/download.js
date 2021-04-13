window.addEventListener("load", function () {
  const hidden_link_element = document.createElement("a");
  hidden_link_element.style.display = "none";
  document.body.appendChild(hidden_link_element);

  const save_data = function (text, file_name) {
    let blob = new Blob([text], {type: "octet/stream"}),
        url = window.URL.createObjectURL(blob);
    hidden_link_element.href = url;
    hidden_link_element.download = file_name;
    hidden_link_element.click();
    window.URL.revokeObjectURL(url);
  };

  const stage_number_element = document.querySelectorAll("#number")[0];
  const stage_json_element = document.querySelectorAll("#stage_json")[0];
  document.querySelectorAll("#download")[0].addEventListener("click", function () {
    let stage_number = Math.round(stage_number_element.value);
    if (stage_number < 0 || 999 < stage_number) {
      return;
    }

    let file_name = `stage_${stage_number.toString().padStart(3, "0")}.json`;

    save_data(stage_json_element.innerText, file_name);
  })
});