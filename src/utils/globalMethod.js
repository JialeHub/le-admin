/**
 * @param value
 * @return {Boolean}
 * @description 判断是否为空
 * */
export const notEmpty = value => {
  return !(
    value === undefined
    || value === null
    || (typeof value === "object" && Object.keys(value).length === 0)
    || (typeof value === "string" && value.trim().length === 0)
  );
};

/**
 * @param string
 * @param noAddBase
 * @return {String}
 * @description 添加URL地址+自动去除第一斜杠
 * */
export const addBaseURL = (string, noAddBase) => {
  if (string && string !== '') {
    if (string.charAt(0) !== '/' && string.charAt(0) !== '\\') { string = '/' + string }
    if (string.charAt(string.length - 1) === '/') { string = string.substr(0, string.length - 1) }
    if (noAddBase === true) {
      return string
    } else {
      return process.env.VUE_APP_BASE_URL + string
    }
  } else {
    return ''
  }
}

