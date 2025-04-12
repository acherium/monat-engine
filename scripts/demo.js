import {
  $, $a, $p, $pa, $s, $sa, create, append, after, before,
  set, unset, seal, unseal,
  on,
  xhr,
  LyraWindow,
  LyraColorPicker,
  random, ransel, ranchar
} from "../monat/module.js";

export default function(master) {
  // 아이콘 목록
  const $tabLblIcons = $(`label[target="#demo-icons"]`);
  const $tableIcons = $("#icon-table");

  on($tabLblIcons, "pointerup", () => {
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

  // 창 데모
  const $btnCloseActiveWin = $("#demo-close-active-window");
  const $btnShowAllWin = $("#demo-show-all-window");
  const $btnCloseAllWin = $("#demo-close-all-window");
  const $btnBroadcastAllWin = $("#demo-broadcast-all-window");
  $btnCloseActiveWin.onpointerdown = () => { master.winman.current?.close(); };
  $btnShowAllWin.onclick = () => { master.winman.showAll(); };
  $btnCloseAllWin.onclick = () => { master.winman.closeAll(); };
  $btnBroadcastAllWin.onclick = () => { master.winman.broadcast(new Event("debugging")); };

  const $chkDebuggingWinman = $("#demo-master-winman-debugging");
  $chkDebuggingWinman.onchange = () => { master.winman.setDebugging($chkDebuggingWinman.checked); };

  let demoWinId = -1;
  const $btnOpenWin0 = $("#demo-open-window-0");
  const $btnOpenWin1 = $("#demo-open-window-1");
  const $btnOpenWin2 = $("#demo-open-window-2");
  $btnOpenWin0.onclick = () => master.winman.show("demo-window-0");
  $btnOpenWin1.onclick = () => {
    const demowin = new LyraWindow({
      id: `demo-${++demoWinId}`,
      includes: [
        "titlebar",
        "titlebar-left",
        "titlebar-right",
        "bottom",
        "resize-pointer",
        "close-button",
        "maximize-button",
        "minimize-button"
      ]
    }).setTitle("새 창")
      .setIcon(create("i", { classes: [ "spreadsheet" ] }))
      .setBody(create("windowmain", { properties: { innerHTML: "<p>1234</p>" } }));
    master.winman.register(demowin);
    master.winman.show(demowin.id);
  };
  $btnOpenWin2.onclick = () => {
    master.winman.show("partial-test-window");
  };

  // master.notiman.show("testnoti");
  master.notiman.showOnce({
    duration: 10000,
    icon: "star",
    title: "제목 테스트",
    content: "내용 테스트",
    buttons: [
      create("button", { properties: { innerHTML: "<span>버튼 1</span>" }, events: { click: () => { console.log(true); } } }),
      create("button", { properties: { innerHTML: "<span>버튼 2</span>" }, events: { click: () => { console.log(true); } } }),
      create("button", { properties: { innerHTML: "<span>버튼 3</span>" }, events: { click: () => { console.log(true); } } })
    ]
  });

  master.dictman.set("test_dict", "1234").apply();
  setTimeout(() => { master.dictman.set("test_dict", "4567").apply(); }, 5000);
};