// 각종 변수들
// 내부 변수
export const LYRA_NAME = "Lyra Engine";
export const LYRA_AUTHOR = "Acherium";
export const LYRA_CONTACT = "acherium@pm.me";
export const LYRA_VERSION = "1112";
export const LYRA_DATE = "25-02-23";

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

/**
 * 문서 본문 요소입니다.
 * @see {@link https://developer.mozilla.org/ko/docs/Web/HTML/Element/body | MDN 레퍼런스> <body>: 문서 본문 요소}
 */
export const body = document.body;

// 환경 변수
export const lyraEnv = {
  theme: "auto"
};
export const DICT_LYRA_ENV = {
  theme: [ "auto", "light", "dark" ]
};


// 각종 함수들
/**
 * 입력받은 객체 형식의 값을 깊은 동결(Deep Freeze)처리합니다.
 * @param {*} obj 객체 형식의 값
 * @see {@link https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze | MDN 레퍼런스> Object.freeze()}
 */
export const freeze = (obj) => {
  for (const value of Object.values(obj)) if (typeof value === "object" && typeof value[Symbol.iterator] === "function") freeze(value);
  Object.freeze(obj);
  return;
};

/**
 * 입력받은 값을 깊은 복사(Deep Copy)하고 그 값을 반환합니다.
 * @param {*} val 아무 값, 변수, 배열, etc...
 * @returns {*} 복사된 값
 * @see {@link https://developer.mozilla.org/ko/docs/Glossary/Deep_copy | MDN 레퍼런스> 깊은 복사}
 */
export const copy = (val) => {
  return JSON.parse(JSON.stringify(val));
};

/**
 * 제공한 선택자와 일치하는 첫 번째 HTML 요소를 반환하고, 일치하는 개체가 없다면 null을 반환합니다.
 * @param {string} query 선택자.
 * @param {HTMLElement} [target] 탐색 대상 요소. 제공되지 않으면 기본적으로 Document에서 탐색합니다.
 * @returns {HTMLElement | null}
 * @see {@link https://developer.mozilla.org/ko/docs/Web/API/Document/querySelector | MDN 레퍼런스> Document.querySelector()}
 */
export const $ = (query, target = document) => target.querySelector(query);

/**
 * 제공한 선택자와 일치하는 모든 HTML 요소를 NodeList로 반환합니다.
 * @param {string} query 선택자.
 * @param {HTMLElement} [target] 탐색 대상 요소. 제공되지 않으면 기본적으로 document에서 탐색합니다.
 * @returns {NodeList}
 * @see {@link https://developer.mozilla.org/ko/docs/Web/API/Document/querySelectorAll | MDN 레퍼런스> Document.querySelectorAll()}
 */
export const $a = (query, target = document) => target.querySelectorAll(query);

/**
 * create 함수 매개변수 구조체
 * @typedef {object} LyraCreateParameters
 * @property {id} [id] 요소에 적용할 ID의 이름.
 * @property {array} [classes] 요소에 적용할 클래스의 목록.
 * @property {object} [attributes] 요소에 적용할 속성값(Attributes)의 객체 형식의 모음집.
 * @property {object} [properties] 요소에 적용할 속성값(Properties)의 객체 형식의 모음집.
 * @property {object} [events] 요소에 적용할 이벤트의 객체 형식의 모음집.
 */
/**
 * 지정한 태그명의 HTML 요소를 만들어 반환합니다. 매개변수가 지정된 경우 지정된 값에 따라 속성이나 이벤트를 설정하고 반환합니다.
 * @param {string} tag HTML 요소명.
 * @param {LyraCreateParameters} [params] 매개변수.
 * @returns {HTMLElement} 지정한 태그에 따라 반환합니다.
 * @see {@link https://developer.mozilla.org/ko/docs/Web/API/Document/createElement | MDN 레퍼런스> Document.createElement()}
 * @see {@link https://developer.mozilla.org/ko/docs/Web/API/Element/setAttribute | MDN 레퍼런스> Document.setAttribute()}
 * @see {@link https://developer.mozilla.org/ko/docs/Web/API/EventTarget/addEventListener | MDN 레퍼런스> EventTarget.addEventListener()}
 */
export const create = (tag = "div", params = { id: null, classes: [], attributes: {}, properties: {}, events: {} }) => {
  const res = document.createElement(tag);
  if (params) {
    if (params.id && params.id !== null) res.id = params.id;
    if (params.classes?.length > 0) for (const value of params.classes) res.classList.add(value);
    if (params.attributes) for (const key in params.attributes) res.setAttribute(key, params.attributes[key]);
    if (params.properties) for (const key in params.properties) res[key] = params.properties[key];
    if (params.events) for (const key in params.events) res.addEventListener(key, params.events[key]);
  };
  return res;
};

/**
 * 지정한 HTML 요소를 특정 HTML 요소에 자식으로 추가하고, 추가한 요소를 반환합니다.
 * @param {HTMLElement} node 추가할 HTML 요소.
 * @param {HTMLElement} [target] 추가할 목적지인 HTML 요소. 제공되지 않으면 기본적으로 문서 본문 요소(Body)에 추가합니다.
 * @returns {HTMLElement} 추가한 요소를 반환합니다.
 * @see {@link https://developer.mozilla.org/ko/docs/Web/API/Node/appendChild | MDN 레퍼런스> Node.appendChild()}
 */
export const append = (node, target = body) => target.appendChild(node);

/**
 * 지정한 HTML 요소를 부모 요소로부터 회수합니다. 회수된 요소는 삭제되지 않고 DOM에 남아있으므로 재사용이 가능해집니다.
 * @param {HTMLElement} node HTML 요소
 * @returns {HTMLElement} 회수한 자손 요소.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild | MDN 레퍼런스(영문)> Node: removeChild() method}
 */
export const revoke = (node) => node.parentNode.removeChild(node);

/**
 * 지정한 HTML 요소의 속성 값을 불러옵니다. 찾는 속성 값이 없다면 null을 반환합니다.
 * @param {HTMLElement} node HTML 요소.
 * @param {string} name 찾는 속성 이름.
 * @returns {* | null}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute | MDN 레퍼런스(영문)> Element: getAttribute() method}
 */
export const get = (node, name) => node.getAttribute(name);

/**
 * 지정한 HTML 요소의 속성 값을 설정하거나 바꿉니다. 대상 HTML 요소를 반환합니다.
 * @param {HTMLElement} node HTML 요소.
 * @param {string} name 속성 이름.
 * @param {*} value 속성 값.
 * @returns {HTMLElement}
 * @see {@link https://developer.mozilla.org/ko/docs/Web/API/Element/setAttribute | MDN 레퍼런스> Element.setAttribute()}
 */
export const set = (node, name, value) => {
  console.log(node);
  node.setAttribute(name, value);
  return node;
};

/**
 * 지정한 HTML 요소의 속성 값을 제거합니다. 대상 HTML 요소를 반환합니다.
 * @param {HTMLElement} node HTML 요소.
 * @param {string} name 제거할 속성 이름.
 * @returns {HTMLElement}
 * @see {@link https://developer.mozilla.org/ko/docs/Web/API/Element/removeAttribute | MDN 레퍼런스| Element.removeAttribute()}
 */
export const unset = (node, name) => {
  node.removeAttribute(name);
  return node;
};

// 환경변수 고정
Object.seal(lyraEnv);
freeze(DICT_LYRA_ENV);