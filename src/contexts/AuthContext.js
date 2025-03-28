import { createContext, useState, useContext, useEffect } from 'react';
import { setAuthToken } from '../api/auth';

// 创建认证上下文
const AuthContext = createContext(null);

// 认证上下文提供者组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // 初始化时检查本地存储中的token
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        setAuthToken(storedToken);
        // 这里可以添加验证token有效性的逻辑
        // 例如调用API获取用户信息
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // 登录函数
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    setAuthToken(userToken);
  };

  // 注销函数
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  // 检查是否已认证
  const isAuthenticated = () => !!token;

  // 提供的上下文值
  const contextValue = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义钩子，方便使用认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth必须在AuthProvider内使用');
  }
  return context;
};

export default AuthContext; 