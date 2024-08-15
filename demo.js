import { append, create, LyraButton } from "./lyra/lyra-script.js";

(() => {
  const btn1 = new LyraButton({
    id: "test-btn",
    classes: [ "a", "b" ],
    events: {
      click: () => alert(true)
    },
    text: "123",
    icon: "star5"
  });
  append(btn1);
})();