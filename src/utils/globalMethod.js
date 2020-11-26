export {RSAEncrypt} from './cryptology'

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
    if (string.charAt(0) !== '/' && string.charAt(0) !== '\\') {
      string = '/' + string
    }
    if (string.charAt(string.length - 1) === '/') {
      string = string.substr(0, string.length - 1)
    }
    if (noAddBase === true) {
      return string
    } else {
      return process.env.VUE_APP_BASE_URL + string
    }
  } else {
    return ''
  }
}

/**
 * @param {Object} target
 * @param {Object} object
 * @description target从object中取值 target <= object
 * */
export const objectEvaluate = (target, object) => {
  for (let key in target) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      if (object[key] instanceof Array) {
        target[key] = [...object[key]]
      } else {
        target[key] = object[key]
      }
    }
  }
};

/**
 * @param data
 * @return {String}
 * @description 尝试JSON格式化
 * */
export const tryJSONStringify = (data) => {
  try {
    return JSON.stringify(data)
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.warn('JSON转化失败：', data)
    return data
  }
}

/**
 * @param data
 * @description 尝试JSON解析
 * */
export const tryJSONParse = (data) => {
  try {
    return JSON.parse(data)
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.warn('json解析失败：', data)
    return data
  }
}

/**
 * @param {string} objPath
 * @param {object} source
 * @description 尝试读取未知对象 例tryReadUnknown(INFO,".info.rememberMe")
 */
export const tryReadUnknown = (source,objPath ) => {
  let successFlag = true
  const objStrArr = objPath.split('.')
  const objStr = [...objStrArr]
  objStr.shift()
  let objTemp = source
  let i
  try {
    for (i = 0; i < objStr.length; i++) {
      if (objTemp[objStr[i]] !== undefined) {
        objTemp = objTemp[objStr[i]]
      } else {
        successFlag = false
        break
      }
    }
    return successFlag ? objTemp : undefined;
  } catch (e) {
    if (process.env.NODE_ENV === 'development') console.warn(e)
    return undefined
  }
}

/**
 * @description 深拷贝函数
 **/
export function deepClone(data) {
  const type = (obj) => {
    let toString = Object.prototype.toString;
    let map = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object'
    };
    return map[toString.call(obj)];
  }
  let t = type(data), o, i, ni;
  if (t === 'array') {
    o = [];
  } else if (t === 'object') {
    o = {};
  } else {
    return data;
  }
  if (t === 'array') {
    for (i = 0, ni = data.length; i < ni; i++) {
      o.push(deepClone(data[i]));
    }
    return o;
  } else if (t === 'object') {
    for (i in data) {
      if (Object.prototype.hasOwnProperty.call(data, i)) {
        o[i] = deepClone(data[i]);
      }
    }
    return o;
  }
}
