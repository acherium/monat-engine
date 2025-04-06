// menuman - 메뉴 요소 조작 관련 모듈 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
import { COMMON_INTERVAL, WINDOW_ANIMATION_DURATION, WINDOW_ANIMATION_TIMING_FUNCTION,
  PANEL_DIRECTION_PARAMETERS, PANEL_DIRECTION_VALUE } from "./lyra-envman.js";
import { on, send } from "./lyra-eventman.js";
import {
  $, $a, $p, $pa, create, append, revoke, after, before,
  get, set, unset, revokeAttribute,
  body
} from "./lyra-domman.js";

export const LyraPanelManager = class {
  name = null;
  debugging = false;

  reserve = {};
  opened = {};
  current = null;

  listener = new EventTarget();

  constructor(name, debugging = false) {
    if (name && typeof name === "string") this.name = name;
    this.debugging = debugging;

    return this;
  };

  retrieve = (target = document, param = {}) => {
    const retrieveTargets = {};
    for (const x of Array.from($a("panel[id]", target)).map((x) => [ x.id, new LyraPanel(param, x) ])) {
      this.reserve[x[0]] = x[1];
      this.reserve[x[0]].master = this;
      retrieveTargets[x[0]] = x[1];
    };
    return retrieveTargets;
  };

  register = (target) => {
    if (!target || target.constructor !== LyraPanel || !target.id) return this;
    target.master = this;
    this.reserve[target.id] = target;
    return this;
  };

  show = (id, f = true) => {
    if (!id || typeof id !== "string") return;

    const target = this.reserve[id];
    if (!target) return;

    this.opened[id] = target;
    if (f) target.show();

    return this;
  };

  close = (id, f = true) => {
    if (!id || typeof id !== "string") return;

    const target = this.reserve[id];
    if (!target) return;

    delete this.opened[id];
    if (f) target.close(false);

    const last = Object.values(this.opened).sort((a, b) => a.lastActive > b.lastActive).pop();
    last?.active();

    return this;
  };

  active = (id, f = true) => {
    if (!id || typeof id !== "string") return this;
    
    const target = this.reserve[id];
    if (!target) return;

    this.current = target;
    if (f) target.active();

    return this;
  };

  inactive = (f = true) => {
    if (!this.current) return this;

    if (f) this.current.inactive();
    this.current = null;

    return this;
  };

  showAll = () => { for (const x of Object.values(this.reserve)) x.show(); };

  closeAll = () => { for (const x of Object.values(this.reserve)) x.close(); };

  broadcast = (event) => { for (const x of Object.values(this.reserve)) send(x.listener, event); };

  setDebugging = (bool) => {
    this.debugging = bool;

    const debuggingStatus = new Event("debuggingstatus");
    debuggingStatus.status = bool;
    this.broadcast(debuggingStatus);
  };
};

export const LyraPanel = class {
  parent = null;
  master = null;
  id = null;

  status = false;
  closed = true;

  lastOpen = null;
  lastClose = null;
  lastActive = null;
  lastInactive = null;

  parts = {
    $: null,
    outer: {
      $: null
    },
    inner: {
      $: null,
      titlebar: {
        $: null,
        left: {
          $: null,
          icon: {
            $: null
          },
          title: {
            $: null,
            text: null
          }
        },
        right: {
          $: null
        }
      },
      main: {
        $: null
      },
      bottom: {
        $: null
      }
    }
  };
  partsOrigin = null;

  direction = "left";

  listener = new EventTarget();

  constructor(param = {}, origin = null) {
    const includeList = param.includes || [];

    // 원본 요소가 있으면 원본에서 지정함
    if (origin) {
      this.parent = origin.parentNode;
      this.id = origin.id;

      // main 요소
      this.parts.$ = revoke(origin);

      // outer 요소
      this.parts.outer.$ = $("outer", this.parts.$);

      // inner 요소
      this.parts.inner.$ = $("inner", this.parts.$);

      // inner - titlebar 요소
      this.parts.inner.titlebar.$ = $("titlebar", this.parts.inner.$);

      this.parts.inner.titlebar.left.$ = $(".left", this.parts.inner.titlebar.$);
      this.parts.inner.titlebar.left.icon.$ = $(".icon", this.parts.inner.titlebar.left.$);
      this.parts.inner.titlebar.left.title.$ = $("span", this.parts.inner.titlebar.left.$);
      this.parts.inner.titlebar.left.title.text = this.parts.inner.titlebar.left.title.$?.innerText || null;

      this.parts.inner.titlebar.right.$ = $(".right", this.parts.inner.titlebar.$);

      // inner - main 요소
      this.parts.inner.main.$ = $("panelmain", this.parts.inner.$);

      // inner - bottom 요소
      this.parts.inner.bottom.$ = $("bottom", this.parts.inner.$);

      // 진입 방향 불러오기
      if (get(this.parts.$, "right") !== null) this.direction = "right";
      else if (get(this.parts.$, "top") !== null) this.direction = "top";
      else if (get(this.parts.$, "bottom") !== null) this.direction = "bottom";
      else if (get(this.parts.$, "center") !== null) this.direction = "center";
    } else {
      this.parent = body;

      // main 요소
      this.parts.$ = create("panel");

      // inner 요소
      this.parts.inner.$ = append(create("inner"), this.parts.$);

      // inner - titlebar 요소
      this.parts.inner.titlebar.$ = append(create("titlebar"), this.parts.inner.$);

      this.parts.inner.titlebar.left.$ = append(create("div", { classes: [ "left" ] }), this.parts.inner.titlebar.$);

      this.parts.inner.titlebar.right.$ = append(create("div", { classes: [ "right" ] }), this.parts.inner.titlebar.$);
      append(create("button", { attributes: { "closepanel": "" } }), this.parts.inner.titlebar.right.$);

      // inner - main 요소
      this.parts.inner.main.$ = append(create("panelmain"), this.parts.inner.$);

      // inner - bottom 요소
      if (includeList.includes("bottom")) this.parts.inner.bottom.$ = append(create("bottom"), this.parts.inner.$);

      // ID 불러오기
      if (typeof param.id !== "undefined") {
        this.id = param.id;
        this.parts.$.id = param.id;
      };

      // 진입 방향 불러오기
      if (typeof param.direction !== "undefined") {
        if (PANEL_DIRECTION_PARAMETERS.includes(param.direction)) this.direction = param.direction;
        set(this.parts.$, this.direction, "");
      };
    };

    // 창 닫기
    const closeTriggers = $a("[closepanel]", this.parts.$);
    for (const node of closeTriggers) {
      if ($a("*", node).length < 1) append(create("i", { classes: [ "close" ] }), node);
      on(node, "pointerup", this.close);
    };
    if (this.parts.outer.$) this.parts.outer.$.onclick = () => { this.close(this.id); };

    // 창 활성화
    on(this.parts.inner.$, "pointerdown", this.active);
    
    // 파라미터 재정의
    for (const key of Object.keys(param)) if (typeof this[key] !== "undefined") this[key] = param[key];

    // 최초 데이터 정의
    this.partsOrigin = JSON.stringify(this.parts);
    this.rectOrigin = JSON.stringify(this.rect);

    // 디버깅용 이벤트 정의
    on(this.listener, "debugging", () => {
      if (!this.master || !this.master.debugging) return;
      console.log(this);
    });
    on(this.listener, "debuggingstatus", (event) => {
      if (this.parts.inner.titlebar.left.title.$) {
        if (this.master.debugging) this.parts.inner.titlebar.left.title.$.innerHTML = `${this.parts.inner.titlebar.left.title.text} (master: ${this.master.name}, id: ${this.id})`;
        else this.parts.inner.titlebar.left.title.$.innerText = this.parts.inner.titlebar.left.title.text;
      };
    });

    return this;
  };

  show = () => {
    this.active();
    if (!this.closed) return this;
    this.closed = false;

    this.lastOpen = new Date();
    
    this.parts.inner.$.animate([ { opacity: "0" } ], { fill: "both" });
    this.parts.inner.$.animate([ { transform: `${PANEL_DIRECTION_VALUE[this.direction]} scale(0.99)` } ],
    {
      fill: "both",
      composite: "accumulate"
    });

    append(this.parts.$, this.parent);

    if (this.parts.outer.$) this.parts.outer.$.animate([ { opacity: "0" }, { opacity: "1" }], { duration: WINDOW_ANIMATION_DURATION, fill: "both" });
    this.parts.inner.$.animate([ { opacity: "0" }, { opacity: "1" } ],
      {
        duration: WINDOW_ANIMATION_DURATION,
        fill: "both",
        ease: WINDOW_ANIMATION_TIMING_FUNCTION
      });
    this.parts.inner.$.animate([ { transform: `${PANEL_DIRECTION_VALUE[this.direction]} scale(0.99)` }, { transform: `translateX(0px) translateY(0px) scale(1)` } ],
      {
        duration: WINDOW_ANIMATION_DURATION,
        fill: "both",
        ease: WINDOW_ANIMATION_TIMING_FUNCTION
      });
  
    if (this.master) {
      this.master.show(this.id, false);

      if (this.parts.inner.titlebar.left.title.$) {
        if (this.master.debugging) this.parts.inner.titlebar.left.title.$.innerHTML = `${this.parts.inner.titlebar.left.title.text} (master: ${this.master.name}, id: ${this.id})`;
        else this.parts.inner.titlebar.left.title.$.innerText = this.parts.inner.titlebar.left.title.text;
      };
    };

    send(this.listener, "show");
    return this;
  };

  close = () => {
    if (this.closed) return this;
    this.closed = true;
    this.inactive();

    this.lastClose = new Date();

    if (this.parts.outer.$) this.parts.outer.$.animate([ { opacity: "1" }, { opacity: "0" }], { duration: WINDOW_ANIMATION_DURATION, fill: "both" });
    this.parts.inner.$.animate([ { opacity: "1" }, { opacity: "0" } ],
      {
        duration: WINDOW_ANIMATION_DURATION,
        fill: "both",
        ease: WINDOW_ANIMATION_TIMING_FUNCTION
      });
    this.parts.inner.$.animate([ { transform: "translateX(0px) translateY(0px) scale(1)" }, { transform: `${PANEL_DIRECTION_VALUE[this.direction]} scale(0.99)` } ],
      {
        duration: WINDOW_ANIMATION_DURATION,
        fill: "both",
        ease: WINDOW_ANIMATION_TIMING_FUNCTION
      });

    setTimeout(() => {
      this.parts.$ = revoke(this.parts.$);
    }, WINDOW_ANIMATION_DURATION + COMMON_INTERVAL);

    if (this.master) this.master.close(this.id, false);

    send(this.listener, "close");
    return this;
  };

  active = () => {
    for (const node of Array.from($a("panel[active]")).filter((x) => x !== this.parts.$)) unset(node, "active");
    if (get(this.parts.$, "active") === null) {
      set(this.parts.$, "active", "");
      this.parent.insertAdjacentElement("beforeend", this.parts.$);
    };

    this.lastActive = new Date();

    this.status = true;
    if (this.master) this.master.active(this.id, false);

    send(this.listener, "active");
    return this;
  };

  inactive = () => {
    unset(this.parts.$, "active");

    this.lastInactive = new Date();
    
    this.status = false;
    if (this.master) this.master.inactive(false);

    send(this.listener, "inactive");
    return this;
  };
};