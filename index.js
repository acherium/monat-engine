import {
  $, create, append,
  set, unset
} from "./monat/module.js";

(() => {
  // 아이콘 목록
  const $tabLblIcons = $(`label[target="#demo-icons"]`);
  const $tableIcons = $("#icon-table");

  $tabLblIcons.addEventListener("pointerup", () => {
    $tableIcons.textContent = "";
    const appendIconTable = (list) => {
      for (const name of list) {
        const $item = create("div");
        append(create("il", { classes: [ name ] }), $item);
        append(create("span", { properties: { innerText: name } }), $item);
        append($item, $tableIcons);
      };
    };

    fetch("./monat/stylesheets/icons/lyra-icons.css").then((res) => res.text()).then((raw) => {
      const iconList = raw.split("\n").map((x) => x.trim()).filter((x) => x.startsWith("--lyra-icon-")).map((x) => x.split(":")[0].substring("--lyra-icon-".length));
      appendIconTable(iconList);

      const $btnSearchIcon = $("#search-icon-name-do");
      const $inputSearchIcon = $("#search-icon-name-input");
      $btnSearchIcon.onclick = () => {
        $tableIcons.textContent = "";
        const filteredList = iconList.filter((x) => x.indexOf($inputSearchIcon.value) !== -1);
        appendIconTable(filteredList);
      };
      $inputSearchIcon.onkeydown = (event) => { if (event.key === "Enter") $btnSearchIcon.click(); };
    });
  });

  // 다크모드 토글
  const $chkDarkmode = $("#toggle-darkmode");
  $chkDarkmode.onchange = () => $chkDarkmode.checked ? set(document.documentElement, "forcedarkmode", "") : unset(document.documentElement, "forcedarkmode");
})();