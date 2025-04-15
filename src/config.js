/**
 * 应用全局配置
 */
const config = {
  // API 配置
  api: {
    // API基础URL
    baseURL: process.env.REACT_APP_BACK_END_API_URL || 'http://127.0.0.1:8000/api/v1',
    // API请求超时时间（毫秒）
    timeout: 30000, // 默认超时时间增加到30秒
    // LLM相关API的超时时间（毫秒）
    llmTimeout: 1200000, // LLM相关API超时时间设置
    // API路径前缀
    prefix: '',
    // 刷新token的路径
    refreshTokenPath: '/auth/refresh-token',
  },

  // 本地存储配置
  storage: {
    // 存储前缀，便于多应用部署区分
    prefix: 'gradnote_',
    // 用户信息存储KEY
    userKey: 'user',
    // Token存储KEY
    tokenKey: 'token',
    // 刷新Token存储KEY
    refreshTokenKey: 'refresh_token',
  },

  // 应用UI配置
  ui: {
    // 是否开启反馈功能 (message, notification等)
    enableFeedback: true,
    // 默认分页大小
    defaultPageSize: 10,
  },
};

export default config;