// notiman - 알림 요소 조작 관련 모듈 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
import {
  COMMON_INTERVAL, WINDOW_ANIMATION_DURATION, WINDOW_ANIMATION_TIMING_FUNCTION,
  DEFAULT_TOAST_DURATION
} from "./lyra-envman.js";
import { on, once, off, send } from "./lyra-eventman.js";
import {
  $, $a, $p, $pa, create, append, revoke, after, before,
  get, set, unset, revokeAttribute,
  body
} from "./lyra-domman.js";

/**
 * LyraToastNotification 생성자 매개변수 구조체.
 * @typedef {object} LyraToastNotificationParameters
 * @param {string} [text] 텍스트 내용.
 * @param {string} [html] HTML 내용. 지정된 경우 텍스트 내용을 덮어씌웁니다.
 * @param {number} [duration] 유지 시간.
 */

export const LyraNotificationManager = class {
  name = null;
  debugging = null;

  reserve = {};
  opened = {};

  listener = new EventTarget();

  constructor(name, debugging = false) {
    if (name && typeof name === "string") this.name = name;
    this.debugging = debugging;

    return this;
  };

  retrieve = (target = document, param = {}) => {};

  showToast = (param = {}) => {
    new LyraToastNotification(param).show();

    return this;
  };
};

export const LyraNotification = class {
  constructor(param = {}, origin = null) {};
};

/**
 * 토스트 알림 요소를 생성합니다.
 * @param {LyraToastNotificationParameters} param 매개변수.
 * @returns {LyraToastNotification} 토스트 알림 요소.
 */
export const LyraToastNotification = class {
  duration = DEFAULT_TOAST_DURATION;
  timeout = null;

  parts = {
    $: null,
    main: {
      $: null
    }
  };

  constructor(param = {}) {
    this.parts.$ = create("toast");
    this.parts.main.$ = append(create("toastmain"), this.parts.$);

    if (typeof param.text !== "undefined") this.parts.main.$.innerText = param.text;
    if (typeof param.html !== "undefined") this.parts.main.$.innerHTML = param.html;
    if (typeof param.duration !== "undefined" && !Number.isNaN(Number(param.duration))) this.duration = Number(param.duration);

    return this;
  };

  /**
   * 토스트 알림을 표시합니다.
   * @returns {LyraToastNotification} 토스트 알림 요소.
   */
  show = () => {
    this.parts.$.animate([ { transform: "translateY(2px) scale(0.99)" } ],
    {
      fill: "both",
      composite: "accumulate"
    });

    append(this.parts.$, body);
    
    this.parts.$.animate([ { opacity: "0" }, { opacity: "1" } ],
      {
        duration: WINDOW_ANIMATION_DURATION,
        fill: "both",
        ease: WINDOW_ANIMATION_TIMING_FUNCTION
      });
    this.parts.$.animate([ { transform: "translateY(2px) scale(0.99)" }, { transform: "translateY(0px) scale(1)" } ],
      {
        duration: WINDOW_ANIMATION_DURATION,
        fill: "both",
        ease: WINDOW_ANIMATION_TIMING_FUNCTION,
        composite: "accumulate"
      });

    this.timeout = setTimeout(this.close, this.duration);
    return this;
  };

  /**
   * 토스트 알림을 닫습니다.
   * @returns {LyraToastNotification} 토스트 알림 요소.
   */
  close = () => {
    clearTimeout(this.timeout);
    this.timeout = null;

    this.parts.$.animate([ { opacity: "1" }, { opacity: "0" } ],
      {
        duration: WINDOW_ANIMATION_DURATION,
        fill: "both",
        ease: WINDOW_ANIMATION_TIMING_FUNCTION
      });
    this.parts.$.animate([ { transform: "translateY(0px) scale(1)" }, { transform: "translateY(2px) scale(0.99)" } ],
      {
        duration: WINDOW_ANIMATION_DURATION,
        fill: "both",
        ease: WINDOW_ANIMATION_TIMING_FUNCTION,
        composite: "accumulate"
      });

    setTimeout(() => {
      this.parts.$ = revoke(this.parts.$);
    }, WINDOW_ANIMATION_DURATION + COMMON_INTERVAL);

    return this;
  };
};