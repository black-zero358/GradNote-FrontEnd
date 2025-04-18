import axios from 'axios';
import { message } from 'antd';
import config from '../config';
import { getToken, saveToken, clearAuth, getRefreshToken, saveRefreshToken } from '../utils/localStorage';

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 是否正在刷新token
let isRefreshing = false;
// 等待token刷新的请求队列
let refreshSubscribers = [];

// 将请求加入队列
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// 执行队列中的请求
const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// 处理401未授权错误
const handleUnauthorizedError = () => {
  // 清除认证状态
  clearAuth();

  // 如果是浏览器环境，显示错误提示并重定向到登录页面
  if (typeof window !== 'undefined') {
    message.error('用户凭证已过期，请重新登录');

    // 使用延时确保错误消息能够显示
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  }
};

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // 处理特定错误
    if (error.response) {
      // 处理401未授权错误 - Token失效
      if (error.response.status === 401) {
        // 如果存在刷新token且没有重试过
        const refreshToken = getRefreshToken();
        if (refreshToken && !originalRequest._retry && !isRefreshing) {
          originalRequest._retry = true;
          isRefreshing = true;

          try {
            // 尝试刷新token
            const response = await axios.post(`${config.api.baseURL}${config.api.refreshTokenPath}`, {
              refreshToken: refreshToken
            });

            const { access_token, refresh_token } = response.data;

            // 保存新token
            saveToken(access_token);
            if (refresh_token) {
              saveRefreshToken(refresh_token);
            }

            // 更新原始请求和所有等待的请求的Authorization
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            onTokenRefreshed(access_token);

            // 重发原始请求
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            // 刷新token失败，处理401错误
            handleUnauthorizedError();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else if (isRefreshing && !originalRequest._retry) {
          // 已经在刷新token，将请求加入队列
          return new Promise(resolve => {
            subscribeTokenRefresh(token => {
              // 使用新token替换原始请求中的Authorization header
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            });
          });
        } else {
          // 无法刷新token或刷新失败，处理401错误
          handleUnauthorizedError();
          return Promise.reject(error);
        }
      }

      // 处理其他特定错误
      switch (error.response.status) {
        case 400:
          error.message = error.response.data.message || '请求参数错误';
          break;
        case 403:
          error.message = '无权访问该资源';
          break;
        case 404:
          error.message = '请求的资源不存在';
          break;
        case 500:
          error.message = '服务器内部错误';
          break;
        default:
          error.message = error.response.data.message || '请求失败';
      }
    } else if (error.request) {
      // 请求发送成功，但没有收到响应
      error.message = '无法连接到服务器';
    } else {
      // 请求配置出错
      error.message = '请求配置错误';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;