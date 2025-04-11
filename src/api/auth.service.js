import axiosInstance from './axios.config';

/**
 * 用户登录
 * @param {Object} credentials - 登录凭证
 * @param {string} credentials.username - 用户名
 * @param {string} credentials.password - 密码
 * @param {boolean} [credentials.remember] - 是否记住登录状态
 * @returns {Promise} - 返回包含token和用户信息的Promise
 */
export const loginUser = async (credentials) => {
  const { username, password, remember } = credentials;
  
  // 创建表单数据
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  formData.append('grant_type', 'password');
  
  // 发送表单格式的请求
  return axiosInstance.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

/**
 * 用户注册
 * @param {Object} userData - 用户数据
 * @returns {Promise} - 返回注册结果的Promise
 */
export const registerUser = async (userData) => {
  return axiosInstance.post('/auth/register', userData);
};

/**
 * 获取当前用户信息
 * @returns {Promise} - 返回用户信息的Promise
 */
export const getCurrentUser = async () => {
  return axiosInstance.get('/auth/me');
};

/**
 * 退出登录
 * @returns {Promise} - 返回登出结果的Promise
 */
export const logoutUser = async () => {
  return axiosInstance.post('/auth/logout');
};

/**
 * 请求重置密码
 * @param {string} email - 用户邮箱
 * @returns {Promise} - 返回请求结果的Promise
 */
export const requestPasswordReset = async (email) => {
  return axiosInstance.post('/auth/forgot-password', { email });
};

/**
 * 重置密码
 * @param {Object} resetData - 重置密码数据
 * @param {string} resetData.token - 重置密码token
 * @param {string} resetData.password - 新密码
 * @returns {Promise} - 返回重置结果的Promise
 */
export const resetPassword = async (resetData) => {
  const { token, password } = resetData;
  return axiosInstance.post('/auth/reset-password', { token, password });
}; 