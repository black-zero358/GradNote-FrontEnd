import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  saveToken, 
  saveUser, 
  clearAuth, 
  getUser, 
  saveRefreshToken 
} from '../utils/localStorage';
import config from '../config';

/**
 * @typedef {Object} User
 * @property {string} id - 用户ID
 * @property {string} username - 用户名
 * @property {string} [email] - 用户邮箱
 * @property {string} [avatar] - 用户头像URL
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user - 当前登录用户信息
 * @property {boolean} isAuthenticated - 是否已认证
 * @property {boolean} isLoading - 是否正在加载
 * @property {Object|null} error - 错误信息
 * @property {Function} login - 登录操作
 * @property {Function} logout - 登出操作
 * @property {Function} updateUser - 更新用户信息
 * @property {Function} setLoading - 设置加载状态
 * @property {Function} setError - 设置错误信息
 * @property {Function} clearError - 清除错误信息
 */

/**
 * 创建认证状态存储
 * @type {import('zustand').UseBoundStore<AuthState>}
 */
const useAuthStore = create(
  persist(
    (set) => ({
      // 初始状态
      user: getUser(),
      isAuthenticated: !!getUser(),
      isLoading: false,
      error: null,

      /**
       * 登录操作
       * @param {User} userData - 用户数据
       * @param {string} token - 访问令牌
       * @param {string} [refreshToken] - 刷新令牌
       */
      login: (userData, token, refreshToken) => {
        try {
          // 保存用户信息和token
          saveUser(userData);
          saveToken(token);
          
          // 如果提供了刷新令牌，也保存它
          if (refreshToken) {
            saveRefreshToken(refreshToken);
          }
          
          // 更新状态
          set({ 
            user: userData, 
            isAuthenticated: true,
            error: null 
          });
        } catch (error) {
          console.error('登录状态保存失败', error);
          set({ error: { message: '登录状态保存失败' } });
        }
      },

      /**
       * 登出操作
       */
      logout: () => {
        // 清除所有认证数据
        clearAuth();
        set({ 
          user: null, 
          isAuthenticated: false,
          error: null
        });
      },

      /**
       * 更新用户信息
       * @param {User} userData - 用户数据
       */
      updateUser: (userData) => {
        try {
          // 保存更新后的用户信息
          saveUser(userData);
          set({ user: userData });
        } catch (error) {
          console.error('用户信息更新失败', error);
          set({ error: { message: '用户信息更新失败' } });
        }
      },

      /**
       * 设置加载状态
       * @param {boolean} isLoading - 是否正在加载
       */
      setLoading: (isLoading) => set({ isLoading }),

      /**
       * 设置错误信息
       * @param {Object} error - 错误对象
       */
      setError: (error) => set({ error }),

      /**
       * 清除错误信息
       */
      clearError: () => set({ error: null }),
    }),
    {
      name: `${config.storage.prefix}auth-store`, // 持久化存储名称
      storage: createJSONStorage(() => localStorage), // 使用localStorage存储
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }), // 只持久化部分状态
    }
  )
);

export default useAuthStore; 