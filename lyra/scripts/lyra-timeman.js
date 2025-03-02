// timeman - 시간 관련 모듈 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// 변수
/**
 * 시간 표현식 문자 및 메소드입니다.
 */
export const TIME_EXPRESSIONS = {
  "YYYY": (date) => `${date.getFullYear()}`,
  "MM": (date) => `${date.getMonth() + 1}`.padStart(2, "0"),
  "DD": (date) => `${date.getDate()}`.padStart(2, "0"),
  "HH": (date) => `${date.getHours()}`.padStart(2, "0"),
  "hh": (date) => `${date.getHours()}`.padStart(2, "0"),
  "mm": (date) => `${date.getMinutes()}`.padStart(2, "0"),
  "ss": (date) => `${date.getSeconds()}`.padStart(2, "0"),
  "ii": (date) => `${date.getMilliseconds()}`,
  "AA": (date) => `${date.getHours() / 12 < 1 ? "AM" : "PM"}`
};

/**
 * 기본 일시 형식입니다.
 */
export const DEFAULT_TIME_FORMAT_DATETIME = "YYYY-MM-DD HH:mm:ss";

/**
 * 기본 년월일 형식입니다.
 */
export const DEFAULT_TIME_FORMAT_DATE = "YYYY-MM-DD";

/**
 * 기본 시간 형식입니다.
 */
export const DEFAULT_TIME_FORMAT_TIME = "HH:mm:ss";

// 함수
/**
 * 제공된 시간값을 문자열로 반환합니다. 시간값을 제공하지 않으면 생성 순간의 날짜와 시간을 기준으로 합니다.
 * @param {*} time UNIX 타임스탬프 시간값.
 * @param {string} format 시간 형식.
 * @returns {string} 시간 문자열.
 */
export const datetime = (time = null, format = DEFAULT_TIME_FORMAT_DATETIME) => {
  const date = time === null ? new Date() : new Date(time);
  let result = format;

  for (const key of Object.keys(TIME_EXPRESSIONS)) {
    result = result.replace(new RegExp(`(${key})`, "g"), TIME_EXPRESSIONS[key](date));
  };

  return result;
};

/**
 * 제공된 시간값을 문자열(년월일)로 반환합니다. 시간값을 제공하지 않으면 생성 순간의 날짜와 시간을 기준으로 합니다.
 * @param {*} time UNIX 타임스탬프 시간값.
 * @returns {string} 시간 문자열(년월일).
 */
export const date = (time = null) => datetime(time, DEFAULT_TIME_FORMAT_DATE);

/**
 * 제공된 시간값을 문자열(시분초)로 반환합니다. 시간값을 제공하지 않으면 생성 순간의 날짜와 시간을 기준으로 합니다.
 * @param {*} time UNIX 타임스탬프 시간값.
 * @returns {string} 시간 문자열(시분초).
 */
export const time = (time = null) => datetime(time, DEFAULT_TIME_FORMAT_TIME);

/**
 * 현재 시간값을 문자열로 반환합니다.
 * @param {string} format 시간 형식.
 * @returns {string} 시간 문자열.
 */
export const now = (format = DEFAULT_TIME_FORMAT_DATETIME) => datetime(null, format);

/**
 * 현재 시간값을 문자열로 반환합니다.
 * @param {string} format 시간 형식.
 * @returns {string} 시간 문자열.
 */
export const nowDate = (format = DEFAULT_TIME_FORMAT_DATE) => datetime(null, format);

/**
 * 현재 시간값을 문자열로 반환합니다.
 * @param {string} format 시간 형식.
 * @returns {string} 시간 문자열.
 */
export const nowTime = (format = DEFAULT_TIME_FORMAT_TIME) => datetime(null, format);