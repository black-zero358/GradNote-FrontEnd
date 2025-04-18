import { QueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { isAuthenticated, clearAuth } from './utils/localStorage';

// 创建一个函数用于检测网络环境并确定重试策略
const getRetryConfig = (error) => {
  // 不重试的情况：401未授权、404找不到资源、用户已取消请求
  if (
    error?.response?.status === 401 ||
    error?.response?.status === 404 ||
    error.name === 'CanceledError'
  ) {
    return false;
  }

  // 对网络错误和服务器错误重试
  return true;
};

// 创建Query客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 默认配置
      retry: getRetryConfig, // 使用自定义重试配置
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // 指数退避策略
      staleTime: 1000 * 60 * 5, // 5分钟内数据不会变为过时
      cacheTime: 1000 * 60 * 30, // 缓存30分钟
      refetchOnWindowFocus: false, // 窗口聚焦时不重新获取
      refetchOnMount: true, // 组件挂载时重新获取
      onError: (error) => {
        // 全局错误处理
        // 401错误已经在axios拦截器中处理，这里不需要重复处理
        if (error?.response?.status === 401) {
          // 标记错误已处理，避免重复显示错误消息
          error.handled = true;
        } else if (error?.message === 'Network Error') {
          message.error('网络连接失败，请检查网络设置');
        } else if (error?.response?.status >= 500) {
          message.error('服务器错误，请稍后重试');
        } else if (!error?.handled) {
          // 如果错误没有被组件处理，显示默认错误消息
          message.error(error?.response?.data?.message || '操作失败，请重试');
        }

        // 记录错误日志
        console.error('[Query Error]', {
          message: error?.message,
          status: error?.response?.status,
          data: error?.response?.data,
          time: new Date().toISOString(),
        });
      },
    },
    mutations: {
      // 失败时不重试
      retry: false,
      onError: (error) => {
        // 全局错误处理
        if (error?.response?.status === 401 && isAuthenticated()) {
          // 处理认证失效
          message.error('用户凭证已过期，请重新登录');
          // 清除认证并重定向到登录页面
          clearAuth();
          // 使用延时确保错误消息能够显示
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
        }

        // 记录错误日志
        console.error('[Mutation Error]', {
          message: error?.message,
          status: error?.response?.status,
          data: error?.response?.data,
          time: new Date().toISOString(),
        });
      },
    },
  },
});

// 添加全局查询状态变更监听器用于调试
if (process.env.NODE_ENV === 'development') {
  queryClient.setQueryDefaults({
    queryFn: () => {
      throw new Error("未正确实现 queryFn");
    },
  });

  queryClient.setMutationDefaults({
    mutationFn: () => {
      throw new Error("未正确实现 mutationFn");
    },
  });

  // 监控状态变化，便于调试
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'queryUpdated') {
      console.debug(
        `[Query Updated] ${event.query.queryHash}`,
        event.action
      );
    }
  });
}

export default queryClient;