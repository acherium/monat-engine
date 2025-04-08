// templman - HTML 템플릿 관련 모듈 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
import { $, $a, get, set, unset, create, append, unseal, root } from "./lyra-domman.js";
import { on, send } from "./lyra-eventman.js";
import { fetchHTML } from "./lyra-fetchman.js";
import { LyraWindow } from "./lyra-winman.js";
import { COLOR_MODE } from "./lyra-envman.js";

export const LYRA_TEMPLATE_COLOR_PICKER = fetchHTML("./monat/templates/LyraColorPicker.html");

export const LyraColorPicker = class {
  master = null;
  id = null;

  mode = "RGB";
  includeAlpha = true;
  color = {
    r: 0,
    g: 0,
    b: 0,
    h: 0,
    s: 0,
    l: 0,
    a: 100,
    hex: "000000FF"
  };

  parts = {
    window: null,
    preview: {
      $: null
    },
    r: {
      $: null,
      input: {
        $: null
      }
    },
    g: {
      $: null,
      input: {
        $: null
      }
    },
    b: {
      $: null,
      input: {
        $: null
      }
    },
    h: {
      $: null,
      input: {
        $: null
      }
    },
    s: {
      $: null,
      input: {
        $: null
      }
    },
    l: {
      $: null,
      input: {
        $: null
      }
    },
    a: {
      $: null,
      input: {
        $: null
      }
    },
    hex: {
      input: {
        $: null
      },
      button: {
        $: null
      }
    }
  };

  listener = new EventTarget();

  constructor(master, id, param = {}) {
    if (!master || !master.winman || !id || id.constructor !== String) return;

    this.master = master;
    this.id = id;

    if (typeof param.mode !== "undefined" && COLOR_MODE.includes(param.mode)) this.mode = param.mode;
    if (typeof param.includeAlpha !== "undefined" && param.includeAlpha.constructor === Boolean) this.includeAlpha = param.includeAlpha;
    if (typeof param.color !== "undefined") {
      for (const key of Object.keys(this.color)) {
        if (typeof param.color[key] === "undefined") continue;
        this.color[key] = param.color[key];
      };
    };

    LYRA_TEMPLATE_COLOR_PICKER.then(($seal) => {
      const $items = $a(".RANGE-ITEM:has(.RANGE)", $seal);
      for (const $item of $items) {
        const $range = $(".RANGE", $item);
        const target = get($range, "target");

        this.parts[target.toLowerCase()].$ = $item;
        this.parts[target.toLowerCase()].input.$ = $range;
      };

      const $inputHex = $(".INPUT.HEX", $seal);
      const $btnHex = $(".BUTTON.HEX", $seal);
      this.parts.hex.input.$ = $inputHex;
      this.parts.hex.button.$ = $btnHex;

      for (const [ key, value ] of Object.entries(this.color)) {
        this.parts[key].input.$.value = value;
        set(this.parts[key].input.$, "defaultValue", value);
        send(this.parts[key].input.$, "input");

        on(this.parts[key].input.$, "input", () => {
          this.setColorByKey(key);
        });
      };

      const $preview = $(".PREVIEW", $seal);
      this.parts.preview.$ = $preview;

      this.parts.window = new LyraWindow({ id: this.id, parent: root, maximizable: false, minimizable: false }, $(".LYRA-COLOR-PICKER", $seal));
      this.master.winman.register(this.parts.window);

      this.setMode(this.mode);
      this.setIncludeAlpha(this.includeAlpha);
      this.setColorByKey();
    });

    return this;
  };

  show() {
    this.master.winman.show(this.id);

    return this;
  };

  setMode(mode) {
    if (!COLOR_MODE.includes(mode)) return this;

    this.mode = mode;
    switch(this.mode) {
      case "RGB":
        unset(this.parts.r.$, "none");
        unset(this.parts.g.$, "none");
        unset(this.parts.b.$, "none");
        set(this.parts.h.$, "none", "");
        set(this.parts.s.$, "none", "");
        set(this.parts.l.$, "none", "");
        break;
      case "HSL":
        set(this.parts.r.$, "none", "");
        set(this.parts.g.$, "none", "");
        set(this.parts.b.$, "none", "");
        unset(this.parts.h.$, "none");
        unset(this.parts.s.$, "none");
        unset(this.parts.l.$, "none");
        break;
    };

    return this;
  };

  setIncludeAlpha(bool) {
    if (bool.constructor !== Boolean) return this;

    this.includeAlpha = bool;
    this.includeAlpha ? unset(this.parts.a.$, "none") : set(this.parts.a.$, "none", "");

    return this;
  };

  setColorByKey(key = "r") {
    switch(key) {
      case "r":
      case "g":
      case "b":
        this.color[key] = parseInt(this.parts[key].input.$.value);
        this.color.hex = this.calcHex(this.color.r, this.color.g, this.color.b, this.color.a);
        break;
      case "h":
      case "s":
      case "l":
      case "a":
        this.color.a = parseInt(this.parts.a.input.$.value);
        this.color.hex = this.calcHex(this.color.r, this.color.g, this.color.b, this.color.a);
        break;
      case "hex":
        this.color.hex = this.parts.hex.input.$.value;
        break;
    };

    this.parts.preview.$.style["background-color"] = `#${this.color.hex}`;

    return this;
  };

  calcHex(r, g, b, a) {
    r = r.toString(16).toUpperCase();
    g = g.toString(16).toUpperCase();
    b = b.toString(16).toUpperCase();
    a = Math.floor(a / 100 * 255).toString(16).toUpperCase();

    r = r.padStart(2, "0");
    g = g.padStart(2, "0");
    b = b.padStart(2, "0");
    a = a.padStart(2, "0");

    return `${r}${g}${b}${a}`;
  };
};