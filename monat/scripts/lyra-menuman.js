// menuman - 메뉴 요소 조작 관련 모듈 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
import {
  COMMON_INTERVAL, WINDOW_ANIMATION_DURATION, WINDOW_ANIMATION_TIMING_FUNCTION,
  CONTEXT_MENU_DIRECTION_PARAMETERS, CONTEXT_MENU_PADDING
} from "./lyra-envman.js";
import { on, once, off, send } from "./lyra-eventman.js";
import {
  $, $a, $p, $pa, create, append, revoke, after, before,
  get, set, unset, revokeAttribute,
  body
} from "./lyra-domman.js";

export const LyraContextMenuManager = class {
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
    for (const x of Array.from($a("contextmenu[id]", target)).map((x) => [ x.id, new LyraContextMenu(param, x) ])) {
      this.reserve[x[0]] = x[1];
      this.reserve[x[0]].master = this;
      retrieveTargets[x[0]] = x[1];
    };
    return retrieveTargets;
  };

  register = (target) => {
    if (!target || target.constructor !== LyraContextMenu || !target.id) return this;
    target.master = this;
    this.reserve[target.id] = target;
    return this;
  };

  show = (id, event, f = true) => {
    if (!id || typeof id !== "string") return;

    const target = this.reserve[id];
    if (!target) return;

    this.opened[id] = target;
    if (f) target.show(event);

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

  toggle = (id, event) => {
    if (!id || typeof id !== "string") return;

    const target = this.reserve[id];
    if (!target) return;

    this.opened[id] = target;
    if (target.closed) target.show(event);

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

  closeElse = (ids = []) => { for (const x of Object.values(this.reserve).filter((y) => !ids.includes(y.id))) x.close(); };
};

export const LyraContextMenu = class {
  parent = null;
  parentMenu = null;
  master = null;
  id = null;

  status = false;
  closed = true;

  lastOpen = null;
  lastClose = null;
  lastActive = null;
  lastInactive = null;

  $ = null;

  position = {
    target: null,
    direction: "mouse"
  };

  listener = new EventTarget();

  constructor(param = {}, origin = null) {
    // 원본 요소가 있으면 원본에서 지정함
    if (origin) {
      this.parent = body;
      this.id = origin.id;

      // main 요소
      this.$ = revoke(origin);

      // 상위 메뉴 불러오기
      if (get(this.$, "parentmenu") !== null) this.parentMenu = get(this.$, "parentmenu");

      // 표시 위치 불러오기
      if (get(this.$, "target") !== null) this.position.target = get(this.$, "target");
      if (get(this.$, "direction") !== null && CONTEXT_MENU_DIRECTION_PARAMETERS.includes(get(this.$, "direction"))) this.position.direction = get(this.$, "direction");
    } else {
      this.parent = body;

      // main 요소
      this.$ = create("contextmenu");

      // ID 불러오기
      if (typeof param.id !== "undefined") {
        this.id = param.id;
        this.parts.$.id = param.id;
      };
    };

    // 항목 클릭 시 닫힘
    on(this.$, "click", (event) => {
      if (get(event.target, "sustain") === null && $p("[sustain]", event.target) === null) this.master.closeAll();
    });

    // 하위 메뉴 열기
    on(this.$, "click", (event) => {
      if (get(event.target, "submenu") !== null) this.master.show(get(event.target, "submenu"), event);
    });

    return this;
  };

  show = (event) => {
    this.active();
    this.closed = false;

    const closeExceptions = this.getParentTree();
    this.master.closeElse(closeExceptions);
    this.lastOpen = new Date();

    const r = this.$.getBoundingClientRect();
    let posX = event.clientX;
    let posY = event.clientY;

    if (this.position.target && this.position.direction !== "mouse") {
      const $target = $(this.position.target);
      
      if ($target) {
        const tr = $target.getBoundingClientRect();

        switch (this.position.direction) {
          case "left":
            posX = Math.ceil(tr.x - r.width - CONTEXT_MENU_PADDING);
            posY = Math.ceil(tr.y);
            break;
          case "right":
            posX = Math.ceil(tr.x + tr.width + CONTEXT_MENU_PADDING);
            posY = Math.ceil(tr.y);
            break;
          case "top":
            posX = Math.ceil(tr.x);
            posY = Math.ceil(tr.y - r.height - CONTEXT_MENU_PADDING);
            break;
          case "bottom":
            posX = Math.ceil(tr.x);
            posY = Math.ceil(tr.y + tr.height + CONTEXT_MENU_PADDING);
            break;
        };
      };
    };

    if (posX < CONTEXT_MENU_PADDING) posX = CONTEXT_MENU_PADDING;
    if (posY < CONTEXT_MENU_PADDING) posY = CONTEXT_MENU_PADDING;

    if (posX + r.width > window.innerWidth) posX = CONTEXT_MENU_PADDING;
    if (posY + r.height > window.innerHeight) posY = CONTEXT_MENU_PADDING;
    
    this.$.animate([ { opacity: "0" } ], { fill: "both" });
    this.$.animate([ { transform: `translateX(${posX}px) translateY(${posY + 2}px) scale(0.99)` } ],
    {
      fill: "both",
      composite: "accumulate"
    });

    append(this.$, this.parent);

    this.$.animate([ { opacity: "0" }, { opacity: "1" } ],
      {
        duration: WINDOW_ANIMATION_DURATION,
        fill: "both",
        ease: WINDOW_ANIMATION_TIMING_FUNCTION
      });
    this.$.animate([ { transform: `translateX(${posX}px) translateY(${posY + 2}px) scale(0.99)` }, { transform: `translateX(${posX}px) translateY(${posY}px) scale(1)` } ],
      {
        duration: WINDOW_ANIMATION_DURATION,
        fill: "both",
        ease: WINDOW_ANIMATION_TIMING_FUNCTION
      });

    if (this.master) this.master.show(this.id, event, false);

    send(this.listener, "show");
    return this;
  };

  close = () => {
    if (this.closed) return this;
    this.inactive();

    this.lastClose = new Date();
    
    this.$.animate([ { opacity: "1" }, { opacity: "0" } ],
      {
        duration: WINDOW_ANIMATION_DURATION,
        fill: "both",
        ease: WINDOW_ANIMATION_TIMING_FUNCTION
      });
    this.$.animate([ { transform: "translateY(0px) scale(1)" }, { transform: "translateY(2px) scale(0.99)" } ],
      {
        duration: WINDOW_ANIMATION_DURATION,
        fill: "both",
        ease: WINDOW_ANIMATION_TIMING_FUNCTION,
        composite: "accumulate"
      });

    setTimeout(() => {
      if (this.$.parentNode) this.$ = revoke(this.$);
      this.closed = true;
    }, WINDOW_ANIMATION_DURATION + COMMON_INTERVAL);

    if (this.master) this.master.close(this.id, false);

    send(this.listener, "close");
    return this;
  };

  active = () => {
    for (const node of Array.from($a("contextmenu[active]")).filter((x) => x !== this.$)) unset(node, "active");
    if (get(this.$, "active") === null) {
      set(this.$, "active", "");
      this.parent.insertAdjacentElement("beforeend", this.$);
    };

    this.lastActive = new Date();

    this.status = true;
    if (this.master) this.master.active(this.id, false);

    send(this.listener, "active");
    return this;
  };

  inactive = () => {
    unset(this.$, "active");

    this.lastInactive = new Date();
    
    this.status = false;
    if (this.master) this.master.inactive(false);

    send(this.listener, "inactive");
    return this;
  };

  getParentTree = () => {
    const res = [ this.id ];

    const f = (target) => {
      if (target.parentMenu) {
        res.push(target.parentMenu);
        f(this.master.reserve[target.parentMenu]);
      };
    };
    f(this);

    return res;
  };
};