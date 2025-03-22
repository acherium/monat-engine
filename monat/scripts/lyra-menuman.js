// menuman - 메뉴 요소 조작 관련 모듈 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
import { COMMON_INTERVAL, WINDOW_ANIMATION_DURATION, POSITION_PARAMETERS, SIZE_PARAMETERS } from "./lyra-envman.js";
import {
  $, $a, $p, $pa, create, append, revoke, after, before,
  get, set, unset, revokeAttribute,
  body
} from "./lyra-domman.js";

export const LyraMenuManager = class {
  name = null;
  debugging = false;

  reserve = {};
  opened = {};

  listener = new EventTarget();

  constructor(name, debugging = false) {
    if (name && typeof name === "string") this.name = name;
    this.debugging = debugging;

    return this;
  };

  retrieve = (target = document, param = {}) => {
    const retrieveTargets = {};
    for (const x of Array.from($a("menu[id]", target)).map((x) => [ x.id, new LyraMenu(param, x) ])) {
      this.reserve[x[0]] = x[1];
      this.reserve[x[0]].master = this;
      retrieveTargets[x[0]] = x[1];
    };
    return retrieveTargets;
  };
};

export const LyraMenu = class {
  constructor() {
    return this;
  };
};