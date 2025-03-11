import {
  root, body, head, $, $a, create, append, revoke, after, before, adjacent,
  get, set, unset,
  xhr,
  DRAG_SCROLLING_THRESHOLD,
  LyraWindowManager, LyraWindow,
  error
} from "./module.js";

const master = {};

/**
 * 대상을 Lyra Engine으로 초기화합니다.
 * @param {HTMLElement} target 대상 요소.
 */
const init = (target) => {
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
    const $targets = $a(get($tab, "target"), target);
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

  // 뷰 모듈 초기화
  for (const partial of $a("partial", target)) {
    const partialType = get(partial, "type");
    const partialSrc = get(partial, "src");
    const partialParent = partial.parentNode;
    
    xhr(partialSrc, {
      load: (data) => {
        if (data.target.status !== 200) {
          error(`Failed to load this partial HTML >>> [${partialType ?? "plain"}]"${partialSrc}"@${partialParent.nodeName} >>> ${data.target.status} ${data.target.statusText}`);
          return;
        };

        const raw = data.target.response;
        const sealed = create("seal", { properties: { innerHTML: raw } });

        const partialman = {};

        if (partialType === "window") partialman.windowReserved = master.winman.retrieve(init(sealed), { parent: partialParent });
        else adjacent(partial, "afterend", ...$a("*", init(sealed)));

        const partialRunners = $a("script[runner][partial]", sealed);
        for (const runner of partialRunners) initPartialRunner(runner, partialman);

        adjacent(partial, "beforebegin", ...$a("link", sealed));

        sealed.remove();
        revoke(partial);
      }
    });
  };

  return target;
};

/**
 * 대상 요소 내부에 정의된 모듈 실행자를 Lyra Engine으로 초기화합니다.
 * @param {HTMLElement} target 대상 요소.
 */
const initRunner = (target) => {
  for (const script of $a("script[runner]", target)) {
    import(script.src).then((x) => {
      x.default(master);
    });
    revoke(script);
  };
};

/**
 * 대상 부분 모듈 실행자를 Lyra Engine으로 초기화합니다.
 * @param {HTMLScriptElement} runner 대상 부분 모듈 실행자.
 * @param {*} partialman 대상 실행자에 제공할 값.
 */
const initPartialRunner = (runner, partialman = null) => {
  import(runner.src).then((x) => {
    x.default(master, partialman);
  });
  revoke(runner);
};

(() => {
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

  // 창 초기화
  master.winman = new LyraWindowManager();
  master.winman.retrieve(root);

  // 초기화
  init(body);
  initRunner(root);
})();