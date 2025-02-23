import {
  body, $, $a,
  get
} from "./lyra-module.js";

/**
 * 대상을 Lyra Engine으로 초기화합니다.
 * @param {HTMLElement} target 초기화 대상
 */
const init = (target) => {
  // 탭 기능 초기화
  const $tabs = $a(`:is(.tabs, .tabs-row, .tabs-column) > label:has(input[type="radio"])`, target);
  for (const $tab of $tabs) {
    const $target = $(get($tab, "target"));
    const $radio = $(`input[type="radio"]`, $tab);
    if (!$target || !$radio) continue;

    const name = get($radio, "name");
    const value = get($radio, "value");
    if (!name || !value) continue;

    $target.style["display"] = $radio.checked ? null : "none";
    $radio.onchange = () => {
      if (!$radio.checked) return;
      
      const $alts = $a(`label:has(input[type="radio"][name="${name}"]:not([value="${value}"]))`);
      for (const $alt of $alts) {
        const $altTarget = $(get($alt, "target"));
        if (!$altTarget) continue;

        $altTarget.style["display"] = "none";
      };

      $target.style["display"] = null;
    };
  };
};

(() => {
  init(body);
})();