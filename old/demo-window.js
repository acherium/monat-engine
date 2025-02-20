import { LyraButton, create, $, LyraWindowManager } from "./lyra/lyra-module.js";

(() => {
  const winman = new LyraWindowManager();

  winman.reserve["test-window"].nodes.menuNodes["test-menu-file"].children["test-menu-close"].onclick = () => winman.reserve["test-window"].close();

  const btn1 = $("#test-button1");
  btn1.onclick = () => {
    winman.reserve["test-window"].show();
  };

  const btn2 = $("#test-button2");
  btn2.onclick = () => {
    winman.reserve["test-window2"].show();
  };
})();