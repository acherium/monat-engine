import {
  $, set, unset,
  LyraPanel
} from "../monat/module.js";

export default function(master, partial) {
  const $btnLeft = $("#demo-open-sidemenu-left");
  const $btnRight = $("#demo-open-sidemenu-right");
  const $btnTop = $("#demo-open-sidemenu-top");
  const $btnBottom = $("#demo-open-sidemenu-bottom");
  const $btnCenter = $("#demo-open-sidemenu-center");

  $btnLeft.onclick = () => master.panelman.show("demo-menu-left");
  $btnRight.onclick = () => master.panelman.show("demo-menu-right");
  $btnTop.onclick = () => master.panelman.show("demo-menu-top");
  $btnBottom.onclick = () => master.panelman.show("demo-menu-bottom");
  $btnCenter.onclick = () => master.panelman.show("demo-menu-center");
  
  const $btnCreateLeft = $("#demo-create-sidemenu-left");
  const $btnCreateRight = $("#demo-create-sidemenu-right");
  const $btnCreateTop = $("#demo-create-sidemenu-top");
  const $btnCreateBottom = $("#demo-create-sidemenu-bottom");
  const $btnCreateCenter = $("#demo-create-sidemenu-center");

  $btnCreateLeft.onclick = () => {
    const demopan = new LyraPanel({
      id: "demo-menu-created-left"
    });
    master.panelman.register(demopan);
    master.panelman.show("demo-menu-created-left");
  };
  $btnCreateRight.onclick = () => {
    const demopan = new LyraPanel({
      id: "demo-menu-created-right",
      direction: "right"
    });
    master.panelman.register(demopan);
    master.panelman.show("demo-menu-created-right");
  };
  $btnCreateTop.onclick = () => {
    const demopan = new LyraPanel({
      id: "demo-menu-created-top",
      direction: "top"
    });
    master.panelman.register(demopan);
    master.panelman.show("demo-menu-created-top");
  };
  $btnCreateBottom.onclick = () => {
    const demopan = new LyraPanel({
      id: "demo-menu-created-bottom",
      direction: "bottom"
    });
    master.panelman.register(demopan);
    master.panelman.show("demo-menu-created-bottom");
  };
  $btnCreateCenter.onclick = () => {
    const demopan = new LyraPanel({
      id: "demo-menu-created-center",
      direction: "center"
    });
    master.panelman.register(demopan);
    master.panelman.show("demo-menu-created-center");
  };
};