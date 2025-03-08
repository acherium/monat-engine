import {
  $, create, append
} from "./monat/module.js";

(() => {
  const $tabLblIcons = $(`label[target="#demo-icons"]`);
  const $tableIcons = $("#icon-table");

  $tabLblIcons.addEventListener("pointerup", () => {
    $tableIcons.textContent = "";
    fetch("./monat/stylesheets/icons/lyra-icons.css").then((res) => res.text()).then((raw) => {
      const iconList = raw.split("\n").map((x) => x.trim()).filter((x) => x.startsWith("--lyra-icon-")).map((x) => x.split(":")[0].substring("--lyra-icon-".length));
      for (const name of iconList) {
        const $item = create("div");
        append(create("il", { classes: [ name ] }), $item);
        append(create("span", { properties: { innerText: name } }), $item);
        append($item, $tableIcons);
      };
    });
  });
})();