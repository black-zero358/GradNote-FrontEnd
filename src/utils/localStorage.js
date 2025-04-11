import config from '../config';

// 使用配置文件中的前缀和键名
const PREFIX = config.storage.prefix;
const USER_KEY = `${PREFIX}${config.storage.userKey}`;
const TOKEN_KEY = `${PREFIX}${config.storage.tokenKey}`;
const REFRESH_TOKEN_KEY = `${PREFIX}${config.storage.refreshTokenKey}`;

/**
 * 安全地保存数据到localStorage
 * @param {string} key - 键名
 * @param {any} value - 要保存的值
 */
const safeSetItem = (key, value) => {
  try {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
    return true;
  } catch (error) {
    console.error(`保存到localStorage失败: ${key}`, error);
    return false;
  }
};

/**
 * 安全地从localStorage获取数据
 * @param {string} key - 键名
 * @param {boolean} isJSON - 是否需要解析JSON
 * @returns {any} - 获取的数据
 */
const safeGetItem = (key, isJSON = false) => {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return null;
    return isJSON ? JSON.parse(value) : value;
  } catch (error) {
    console.error(`从localStorage获取数据失败: ${key}`, error);
    // 如果JSON解析失败，移除可能已损坏的数据
    if (isJSON) {
      localStorage.removeItem(key);
    }
    return null;
  }
};

/**
 * 保存用户信息
 * @param {Object} userData - 用户数据
 * @returns {boolean} - 保存是否成功
 */
export const saveUser = (userData) => {
  return safeSetItem(USER_KEY, userData);
};

/**
 * 获取用户信息
 * @returns {Object|null} - 用户数据或null
 */
export const getUser = () => {
  return safeGetItem(USER_KEY, true);
};

/**
 * 保存访问令牌
 * @param {string} token - 访问令牌
 * @returns {boolean} - 保存是否成功
 */
export const saveToken = (token) => {
  return safeSetItem(TOKEN_KEY, token);
};

/**
 * 获取访问令牌
 * @returns {string|null} - 访问令牌或null
 */
export const getToken = () => {
  return safeGetItem(TOKEN_KEY);
};

/**
 * 保存刷新令牌
 * @param {string} token - 刷新令牌
 * @returns {boolean} - 保存是否成功
 */
export const saveRefreshToken = (token) => {
  return safeSetItem(REFRESH_TOKEN_KEY, token);
};

/**
 * 获取刷新令牌
 * @returns {string|null} - 刷新令牌或null
 */
export const getRefreshToken = () => {
  return safeGetItem(REFRESH_TOKEN_KEY);
};

/**
 * 清除所有认证数据
 */
export const clearAuth = () => {
  try {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('清除认证数据失败', error);
    return false;
  }
};

/**
 * 检查是否已登录
 * @returns {boolean} - 是否已登录
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * 获取所有存储的应用数据
 * @returns {Object} - 应用数据
 */
export const getAllAppData = () => {
  try {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(PREFIX)) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key));
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    return data;
  } catch (error) {
    console.error('获取应用数据失败', error);
    return {};
  }
};

/**
 * 清除所有应用数据
 */
export const clearAllAppData = () => {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key.startsWith(PREFIX)) {
        localStorage.removeItem(key);
      }
    }
    return true;
  } catch (error) {
    console.error('清除应用数据失败', error);
    return false;
  }
}; 