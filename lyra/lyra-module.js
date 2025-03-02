// 모듈 로드
import * as objman from "./scripts/lyra-objman.js";
import * as timeman from "./scripts/lyra-timeman.js";
import * as domman from "./scripts/lyra-domman.js";

// 모듈 정보 변수 초기화
export const LYRA_NAME = "Lyra Engine";
export const LYRA_AUTHOR = "Acherium";
export const LYRA_CONTACT = "acherium@pm.me";
export const LYRA_VERSION = "2000";
export const LYRA_DATE = "25-03-2";

// 기본 변수 초기화
export const COMMON_INTERVAL = 30;
export const ANIMATION_INTERVAL = 30;
export const TOOLTIP_DURATION = 10000;
export const TOOLTIP_ANIMATION_DURATION = 150;
export const WINDOW_ANIMATION_DURATION = 150;
export const WINDOW_ANIMATION_DURATION_LONG = 500;
export const DEFAULT_NOTIFICATION_DURATION = 5000;
export const DEFAULT_IMAGE_SLIDER_INTERVAL = 5000;
export const DEFAULT_IMAGE_SLIDER_DURATION = 500;
export const MINIMUM_WINDOW_WIDTH = 100;
export const MINIMUM_WINDOW_HEIGHT = 100;
export const DEFAULT_WINDOW_WIDTH = 600;
export const DEFAULT_WINDOW_HEIGHT = 400;
export const DEFAULT_WINDOW_X = 10;
export const DEFAULT_WINDOW_Y = 10;

export const DRAG_SCROLLING_THRESHOLD = 50;

export const TEMPLATE_CUBIC_BEZIER_0 = "cubic-bezier(.17, .67, .51, .98)";

export const lyraEnv = {
  theme: "auto"
};
export const DICT_LYRA_ENV = {
  theme: [ "auto", "light", "dark" ]
};

// 모듈 초기화

// objman - JS 개체 조작 관련 모듈 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const freeze = objman.freeze;
export const copy = objman.copy;

// timeman - 시간 관련 모듈 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// 변수
export const TIME_EXPRESSIONS = timeman.TIME_EXPRESSIONS;
export const DEFAULT_TIME_FORMAT_DATETIME = timeman.DEFAULT_TIME_FORMAT_DATETIME;
export const DEFAULT_TIME_FORMAT_DATE = timeman.DEFAULT_TIME_FORMAT_DATE;
export const DEFAULT_TIME_FORMAT_TIME = timeman.DEFAULT_TIME_FORMAT_TIME;
// 함수
export const datetime = timeman.datetime;
export const date = timeman.date;
export const time = timeman.time;
export const now = timeman.now;
export const nowDate = timeman.nowDate;
export const nowTime = timeman.nowTime;

// domman - HTML 조작 관련 모듈 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// 변수
export const body = domman.body;
export const head = domman.head;
// 함수
export const $ = domman.$;
export const $a = domman.$a;
export const create = domman.create;
export const append = domman.append;
export const revoke = domman.revoke;
export const get = domman.get;
export const set = domman.set;
export const unset = domman.unset;

// 환경변수 고정
Object.seal(lyraEnv);
freeze(DICT_LYRA_ENV);