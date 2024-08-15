/**
 * 제공한 선택자와 일치하는 첫 번째 HTML개체를 반환하고, 일치하는 개체가 없다면 null을 반환합니다.
 * @param {string} query 선택자.
 * @param {HTMLElement} target 탐색 대상 개체. 제공되지 않으면 기본적으로 document에서 탐색합니다.
 * @returns {HTMLElement | null}
 * @see {@link https://developer.mozilla.org/ko/docs/Web/API/Document/querySelector | MDN 레퍼런스}
 */
export const $ = (query, target = document) => target.querySelector(query);

/**
 * 제공한 선택자와 일치하는 모든 HTML개체를 NodeList로 반환합니다.
 * @param {string} query 선택자.
 * @param {HTMLElement} target 탐색 대상 개체. 제공되지 않으면 기본적으로 document에서 탐색합니다.
 * @returns {NodeList}
 * @see {@link https://developer.mozilla.org/ko/docs/Web/API/Document/querySelectorAll | MDN 레퍼런스}
 */
export const $a = (query, target = document) => target.querySelectorAll(query);