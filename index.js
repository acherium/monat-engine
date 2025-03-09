import {
  $, $p, $pa, $s, $sa, create, append, after, before,
  set, unset, seal, unseal,
  xhr
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

    (async () => {
      const iconListRaw = await xhr("./monat/stylesheets/icons/lyra-icons.css");
      const iconList = await iconListRaw.target.response.split("\n").map((x) => x.trim()).filter((x) => x.startsWith("--lyra-icon-")).map((x) => x.split(":")[0].substring("--lyra-icon-".length));
      appendIconTable(await iconList);

      const $btnSearchIcon = $("#search-icon-name-do");
      const $inputSearchIcon = $("#search-icon-name-input");
      $btnSearchIcon.onclick = () => {
        $tableIcons.textContent = "";
        const filteredList = iconList.filter((x) => x.indexOf($inputSearchIcon.value) !== -1);
        appendIconTable(filteredList);
      };
      $inputSearchIcon.onkeydown = (event) => { if (event.key === "Enter") $btnSearchIcon.click(); };
    })();
  });

  // 누르면 로딩 상태 되는 버튼 데모
  const $btnDemoSendLoading = $("#demo-button-send-loading");
  $btnDemoSendLoading.onclick = () => {
    const $inIcon = $("i, il", $btnDemoSendLoading);
    const $inText = $("span", $btnDemoSendLoading);
    const originIcon = $inIcon.className;
    const originText = $inText.innerText;
    $inIcon.className = "loading-wheel";
    $inText.innerText = "불러오는 중...";
    set($btnDemoSendLoading, "disabled", "");
    setTimeout(() => {
      $inIcon.className = originIcon;
      $inText.innerText = originText;
      unset($btnDemoSendLoading, "disabled");
    }, 1000);
  };

  // 테스트
})();