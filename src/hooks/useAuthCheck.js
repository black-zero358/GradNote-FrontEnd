import { useEffect } from 'react';
import { message } from 'antd';
import useAuthStore from '../stores/authStore';
import { getToken, getUser } from '../utils/localStorage';
import { logoutUser } from '../api/auth.service';

/**
 * 自定义Hook，用于检查认证状态
 * 
 * 功能：
 * 1. 检查localStorage中的token和user是否存在
 * 2. 如果token或user不存在但isAuthenticated为true，则执行登出操作
 * 3. 如果token过期，显示相应提示
 * 
 * @param {Object} options - 配置选项
 * @param {boolean} options.redirect - 是否在登出后重定向到登录页面
 * @returns {Object} - 返回认证状态相关的对象
 */
const useAuthCheck = (options = { redirect: true }) => {
  const { isAuthenticated, logout, tokenExpired } = useAuthStore();

  useEffect(() => {
    // 检查localStorage中的token和user
    const token = getToken();
    const user = getUser();
    
    // 如果isAuthenticated为true但token或user不存在，执行登出操作
    if (isAuthenticated && (!token || !user)) {
      // 尝试调用后端登出API
      try {
        logoutUser().catch(() => {
          // 忽略API错误，仍然执行前端登出
          console.log('后端登出API调用失败，仅执行前端登出');
        });
      } catch (error) {
        console.error('登出过程中发生错误', error);
      }
      
      // 执行前端登出
      logout();
      
      // 显示提示
      message.warning('登录状态异常，请重新登录');
      
      // 如果需要重定向，跳转到登录页面
      if (options.redirect && typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, [isAuthenticated, logout, options.redirect]);

  return {
    isAuthenticated,
    tokenExpired
  };
};

export default useAuthCheck;
