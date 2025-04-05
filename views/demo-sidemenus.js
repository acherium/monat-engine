import {
  $, set, unset
} from "../monat/module.js";

export default function(master, partial) {
  const $btnLeft = $("#demo-open-sidemenu-left");
  const $btnRight = $("#demo-open-sidemenu-right");
  const $btnTop = $("#demo-open-sidemenu-top");
  const $btnBottom = $("#demo-open-sidemenu-bottom");

  $btnLeft.onclick = () => master.panelman.reserve["demo-menu-left"].show();
  $btnRight.onclick = () => master.panelman.reserve["demo-menu-right"].show();
  $btnTop.onclick = () => master.panelman.reserve["demo-menu-top"].show();
  $btnBottom.onclick = () => master.panelman.reserve["demo-menu-bottom"].show();
};