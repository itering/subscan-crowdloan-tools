import Cookies from 'js-cookie'
/**
 * 获取主域名
 */
export const getHostName = () => {
  let host = window.location && window.location.hostname;
  return host;
}
/**
 * 存储cookie
 */
export const setCookie = (name, value, options) => {
  if (!name) return
  options.domain = getHostName();
  Cookies.set(name, value, options);
}

/**
 * 获取cookie
 */
export const getCookie = (name, options = {}) => {
  if (!name) return
  options.domain = getHostName();
  return Cookies.get(name, options);
}

/**
 * 移除cookie
 */
export const removeCookie = (name, options = {}) => {
  if (!name) return
  options.domain = getHostName();
  Cookies.remove(name, options);
}

/**
 * 存储sessionStorage
 */
export const setSessionStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  try {
    window.sessionStorage.setItem(name, content)
  } catch (error) {
    console.warn('无痕模式下不支持存储，err:%s', error)
    window.sessionStorage.removeItem(name)
  }
}

/**
 * 获取sessionStorage
 */
export const getSessionStore = name => {
  if (!name) return
  return window.sessionStorage.getItem(name)
}

/**
 * 删除localStorage
 */
export const removeSessionStore = name => {
  if (!name) return
  window.sessionStorage.removeItem(name)
}

/**
 * 存储localStorage
 */
export const setLocalStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  try {
    window.localStorage.setItem(name, content)
  } catch (error) {
    console.warn('无痕模式下不支持存储，err:%s', error)
    window.localStorage.removeItem(name)
  }
}

/**
 * 获取localStorage
 */
export const getLocalStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}

/**
 * 删除localStorage
 */
export const removeLocalStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}
