import {
  $, set, unset, on, fetchHTML, fetchJSON
} from "../monat/module.js";

export default function(master, partial) {
  // 누르면 로딩 상태 되는 버튼 데모
  const $btnDemoSendLoading = $("#demo-button-send-loading");
  $btnDemoSendLoading.onclick = () => {
    const $inIcon = $("i, il", $btnDemoSendLoading);
    const $inText = $("span", $btnDemoSendLoading);
    const originIcon = $inIcon.className;
    const originText = $inText.innerText;
    $inIcon.className = "loading-wheel";
    $inText.innerText = "불러오는 중...";
    set($btnDemoSendLoading, "disabled", "");
    setTimeout(() => {
      $inIcon.className = originIcon;
      $inText.innerText = originText;
      unset($btnDemoSendLoading, "disabled");
    }, 1000);
  };

  const $demoRange = $("#demo-range");
  on($demoRange, "change", () => { console.log($demoRange.value); });

  const $btnFetchHTML = $("#demo-fetch-html");
  on($btnFetchHTML, "click", () => {
    fetchHTML("./views/test.html").then(console.log);
  });

  const $btnFetchJSON = $("#demo-fetch-json");
  on($btnFetchJSON, "click", () => {
    fetchJSON("./test.json").then(console.log);
  });
};