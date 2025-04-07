import { $ } from "../monat/module.js";

export default (master) => {
  const $area = $("#context-menu-area");

  $area.oncontextmenu = (event) => {
    master.menuman.show("demo-context-menu-0", event);
    return false;
  };

  const $btnMenu0 = $("#btn-demo-context-menu-1");
  $btnMenu0.onclick = (event) => {
    master.menuman.toggle("demo-context-menu-1", event);
  };
};