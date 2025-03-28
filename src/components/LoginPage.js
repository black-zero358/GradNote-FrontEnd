import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await login(username, password);
      const { access_token, token_type } = response;
      
      // 登录成功，保存token并导航到主页
      authLogin({ username }, access_token);
      navigate('/');
    } catch (err) {
      setError(err.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo">
          <h1>LOGO</h1>
        </div>
        <div className="image-placeholder">
          <img src="/images/placeholder.jpg" alt="Placeholder" />
        </div>
      </div>
      <div className="login-right">
        <div className="login-form-container">
          <h2>登录</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">用户名</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                disabled={loading}
              />
            </div>
            
            <div className="form-group password-group">
              <label htmlFor="password">密码</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  disabled={loading}
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={toggleShowPassword}
                >
                  {showPassword ? "隐藏" : "显示"}
                </button>
              </div>
            </div>
            
            <div className="form-footer">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="rememberMe">记住我</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                忘记密码?
              </Link>
            </div>
            
            <button 
              type="submit" 
              className="login-button" 
              disabled={loading}
            >
              {loading ? "登录中..." : "登录"}
            </button>
          </form>
          
          <div className="signup-link">
            没有账户? <Link to="/register">注册</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 