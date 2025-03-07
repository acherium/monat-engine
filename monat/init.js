import {
  body, head, $, $a, create, append, revoke,
  get, set, unset,
  DRAG_SCROLLING_THRESHOLD
} from "./module.js";

/**
 * 대상을 Lyra Engine으로 초기화합니다.
 * @param {HTMLElement} target 초기화 대상
 */
const init = (target) => {
  // 패비콘 없으면 기본 아이콘으로 설정
  // console.log();
  if (!$(`link[rel="shortcut icon"]`)) {
    append(create("link", {
      properties: {
        rel: "shortcut icon",
        href: "./monat/assets/essentials/favicon-alt.svg",
        type: "image/x-icon"
      }
    }), head);
  };

  // 탭 관련 기능 초기화
  // 탭 목록 넘칠 시 드래그로 스크롤
  const $tabLists = $a(`:is(.tabs, .tabs-row, .tabs-column)`, target);
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
};

(() => {
  init(body);
})();