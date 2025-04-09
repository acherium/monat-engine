// templman - HTML 템플릿 관련 모듈 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
import { $, $a, get, set, unset, create, append, unseal, root } from "./lyra-domman.js";
import { on, send } from "./lyra-eventman.js";
import { fetchHTML } from "./lyra-fetchman.js";
import { LyraWindow } from "./lyra-winman.js";
import { COLOR_MODE, HEX_REGEX } from "./lyra-envman.js";

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
    colorMode: {
      $: null,
      text: {
        $: null
      }
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

      on($btnHex, "click", () => { navigator.clipboard.writeText(`#${this.color.hex}`); });

      const $preview = $(".PREVIEW", $seal);
      this.parts.preview.$ = $preview;

      on(this.parts.hex.input.$, "input", () => { this.parts.hex.input.$.value = this.parts.hex.input.$.value.replace(/#/gi, ""); });

      const $btnMode = $(".CHANGE-COLOR-MODE", $seal);
      const $btnModeText = $(".COLOR-MODE", $btnMode);
      this.parts.colorMode.$ = $btnMode;
      this.parts.colorMode.text.$ = $btnModeText;

      on(this.parts.colorMode.$, "click", () => { this.changeMode(); });

      for (const [ key, value ] of Object.entries(this.color)) {
        this.parts[key].input.$.value = value;
        set(this.parts[key].input.$, "defaultValue", value);
        send(this.parts[key].input.$, "input");

        on(this.parts[key].input.$, "input", () => { this.setColorByKey(key); });
      };

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

  setTitle(text) {
    this.parts.window.setTitle(text);

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

    this.parts.colorMode.text.$.innerText = this.mode;
    return this;
  };

  changeMode() {
    switch(this.mode) {
      case "RGB":
        this.setMode("HSL");
        break;
      case "HSL":
        this.setMode("RGB");
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
        Object.assign(this.color, this.RGBtoHSL(this.color.r, this.color.g, this.color.b));

        for (const [ key, value ] of Object.entries(this.color)) key === "hex" ? {} : this.color[key] = Math.floor(value);
        this.color.hex = this.RGBAtoHEX(this.color.r, this.color.g, this.color.b, this.color.a);

        for (const [ key, value ] of Object.entries(this.color)) {
          this.parts[key].input.$.value = value;
          send(this.parts[key].input.$, "change");
        };
        break;
      case "h":
      case "s":
      case "l":
        this.color[key] = parseInt(this.parts[key].input.$.value);
        Object.assign(this.color, this.HSLtoRGB(this.color.h, this.color.s, this.color.l));

        for (const [ key, value ] of Object.entries(this.color)) key === "hex" ? {} : this.color[key] = Math.floor(value);
        this.color.hex = this.RGBAtoHEX(this.color.r, this.color.g, this.color.b, this.color.a);

        for (const [ key, value ] of Object.entries(this.color)) {
          this.parts[key].input.$.value = value;
          send(this.parts[key].input.$, "change");
        };
        break;
      case "a":
        this.color.a = parseInt(this.parts.a.input.$.value);
        for (const [ key, value ] of Object.entries(this.color)) key === "hex" ? {} : this.color[key] = Math.floor(value);
        this.color.hex = this.RGBAtoHEX(this.color.r, this.color.g, this.color.b, this.color.a);

        for (const [ key, value ] of Object.entries(this.color)) {
          this.parts[key].input.$.value = value;
          send(this.parts[key].input.$, "change");
        };
        break;
      case "hex":
        if (HEX_REGEX.exec(this.parts.hex.input.$.value)) {
          this.color.hex = this.parts.hex.input.$.value;
          Object.assign(this.color, this.HEXtoRGBA(this.color.hex));
          Object.assign(this.color, this.RGBtoHSL(this.color.r, this.color.g, this.color.b));
          for (const [ key, value ] of Object.entries(this.color)) key === "hex" ? {} : this.color[key] = Math.floor(value);
  
          for (const [ key, value ] of Object.entries(this.color)) {
            this.parts[key].input.$.value = value;
            send(this.parts[key].input.$, "change");
          };
        };
        break;
    };

    this.parts.preview.$.style["background-color"] = `#${this.color.hex}`;

    return this;
  };

  RGBAtoHEX(r, g, b, a) {
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

  HEXtoRGBA(hex) {
    return {
      r: Number(`0x${hex.substring(0, 2)}`),
      g: Number(`0x${hex.substring(2, 4)}`),
      b: Number(`0x${hex.substring(4, 6)}`)
    };
  };

  RGBtoHSL(r, g, b) {
    const result = {
      h: 0,
      s: 0,
      l: 0
    };

    r = r / 255;
    g = g / 255;
    b = b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;

    if (chroma > 0) {
      if (max === r) {
        const segment = (g - b) / chroma;
        const shift = (segment < 0 ? 360 : 0) / 60;
        result.h = segment + shift;
      } else if (max === g) {
        const segment = (b - r) / chroma;
        const shift = 120 / 60;
        result.h = segment + shift;
      } else if (max === b) {
        const segment = (r - g) / chroma;
        const shift = 240 / 60;
        result.h = segment + shift;
      };
    };
    result.h *= 60;

    result.l = (max + min) / 2;
    result.s = chroma === 0 ? 0 : chroma / (1 - Math.abs(result.l * 2 - 1));

    result.l *= 100;
    result.s *= 100;

    return result;
  };

  HSLtoRGB(h, s, l) {
    s /= 100;
    l /= 100;

    const a = s * Math.min(l, 1 - l);
    const k = (n) => (n + h / 30) % 12;
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    const result = {
      r: 255 * f(0),
      g: 255 * f(8),
      b: 255 * f(4)
    };

    return result;
  };
};