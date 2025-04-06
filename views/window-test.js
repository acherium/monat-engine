import {
  $, on
} from "../monat/module.js";

export default function(master, partial) {
  const win = partial.windowReserved["partial-test-window"];
  const $test = $("#partial-window-position", win.parts.$);
  on(win.listener, "refresh", () => {
    $test.innerText = `X: ${win.rect.x}, Y: ${win.rect.y}, W: ${win.rect.width}, H: ${win.rect.height}`;
  });
};