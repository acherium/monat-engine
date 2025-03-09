import {
  root, body, head, $, $a, create, append, revoke,
  get, set, unset,
  DRAG_SCROLLING_THRESHOLD,
  LyraWindowManager, LyraWindow
} from "./module.js";

/**
 * 대상을 Lyra Engine으로 초기화합니다.
 * @param {HTMLElement} target 초기화 대상
 */
const init = (target) => {
  // 패비콘 없으면 기본 아이콘으로 설정
  if (!$(`link[rel="shortcut icon"]`)) {
    append(create("link", {
      properties: {
        rel: "shortcut icon",
        href: "./monat/assets/essentials/favicon-alt.svg",
        type: "image/x-icon"
      }
    }), head);
  };

  // :indeterminate 상태의 체크박스 초기화
  const $indeterminateCheckboxes = $a(`input[type="checkbox"][indeterminate]`);
  for (const $checkbox of ($indeterminateCheckboxes)) $checkbox.indeterminate = true;

  // 탭 관련 기능 초기화
  // 탭 목록 넘칠 시 드래그로 스크롤
  const $tabLists = $a(":is(.tabs, .tabs-row, .tabs-column)", target);
  for (const $tabList of $tabLists) {
    if ($tabList.classList.contains("tabs") || $tabList.classList.contains("tabs-row")) {
      // 횡렬 탭 목록의 경우
      $tabList.onpointerdown = (pointer) => {
        if (pointer.pointerType !== "mouse") return;
        let i = 0;

        $tabList.onpointermove = (move) => {
          if (i < DRAG_SCROLLING_THRESHOLD) {
            i += Math.abs(move.movementX);
            return;
          };

          $tabList.scroll($tabList.scrollLeft + move.movementX * -1, 0);
        };

        document.addEventListener("pointerup", () => {
          $tabList.onpointermove = null;
          $tabList.onpointerup = null;
          $tabList.onpointercancel = null;
        }, { once: true });

        $tabList.onpointercancel = () => {
          $tabList.onpointermove = null;
          $tabList.onpointerup = null;
          $tabList.onpointercancel = null;
        };
      };
    } else if($tabList.classList.contains("tabs-column")) {
      // 종렬 탭 목록의 경우
      $tabList.onpointerdown = (pointer) => {
        if (pointer.pointerType !== "mouse") return;
        let i = 0;

        $tabList.onpointermove = (move) => {
          if (i < DRAG_SCROLLING_THRESHOLD) {
            i += Math.abs(move.movementY);
            return;
          };

          $tabList.scroll(0, $tabList.scrollTop + move.movementY * -1);
        };

        document.addEventListener("pointerup", () => {
          $tabList.onpointermove = null;
          $tabList.onpointerup = null;
          $tabList.onpointercancel = null;
        }, { once: true });

        $tabList.onpointercancel = () => {
          $tabList.onpointermove = null;
          $tabList.onpointerup = null;
          $tabList.onpointercancel = null;
        };
      };
    };
  };

  // 탭 항목 숨김/표시
  const $tabs = $a(`:is(.tabs, .tabs-row, .tabs-column) > label:has(input[type="radio"])`, target);
  for (const $tab of $tabs) {
    const $targets = $a(get($tab, "target"));
    const $radio = $(`input[type="radio"]`, $tab);
    if (!$targets || !$radio) continue;

    const name = get($radio, "name");
    const value = get($radio, "value");
    if (!name || !value) continue;

    for (const $target of $targets) {
      $target.style["display"] = $radio.checked ? null : "none";
    };

    $radio.onchange = () => {
      if (!$radio.checked) return;
      
      const $alts = $a(`label:has(input[type="radio"][name="${name}"]:not([value="${value}"]))`);
      for (const $alt of $alts) {
        const $altTargets = $a(get($alt, "target"));
        if (!$altTargets) continue;

        for (const $altTarget of $altTargets) {
          $altTarget.style["display"] = "none";
        };
      };

      for (const $target of $targets) {
        $target.style["display"] = null;
      };
    };
  };

  // 다크모드 강제 토글
  const $tglForceDarkmode = $a("[toggledarkmode]", target);
  const toggleForceDarkmode = (flag = null) => {
    flag = flag || get(root, "forcedarkmode") === null;
    flag ? set(root, "forcedarkmode", "") : unset(root, "forcedarkmode");
    Array.from($a(`input[toggledarkmode]:is([type="checkbox"], [type="radio"])`)).forEach(($node) => $node.checked = flag);
  };
  for (const $node of $tglForceDarkmode) {
    if ($node.nodeName === "INPUT" && [ "checkbox", "radio" ].includes($node.type)) {
      $node.addEventListener("change", () => toggleForceDarkmode($node.checked));
    } else {
      $node.addEventListener("click", () => toggleForceDarkmode());
    };
  };

  // 창 초기화
  const winman = new LyraWindowManager();
  const $btnOpenWin0 = $("#demo-open-window-0");
  const $btnOpenWin1 = $("#demo-open-window-1");
  $btnOpenWin0.onclick = () => winman.reserve["demo-window-0"].show();
  $btnOpenWin1.onclick = () => new LyraWindow({
    includes: [
      "titlebar",
      "titlebar-left",
      "titlebar-right",
      "bottom",
      "close-button",
      "maximize-button",
      "minimize-button"
    ]
  }).setTitle("새 창")
    .setIcon(create("i", { classes: [ "spreadsheet" ] }))
    .setBody(create("windowbody", { properties: { innerHTML: "<p>1234</p>" } })).show();
};

(() => {
  init(body);
})();