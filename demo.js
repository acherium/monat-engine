import { LyraModalManager, LyraModal, LyraButton, create, $, LyraNotification, LyraNotificationManager } from "./lyra/lyra-module.js";

(() => {
  const modalman = new LyraModalManager();
  const notiman = new LyraNotificationManager();
  const btn1 = $("#button-test1");
  const btn2 = $("#button-test2");

  btn1.onclick = () => modalman.reserve["modal-name"].show();

  const testnoti = new LyraNotification({
    icon: "square",
    text: "text notification"
  });
  btn2.onclick = () => testnoti.show();
})();