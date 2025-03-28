import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Settings.css';

const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <div className="settings-container">
      <div className="settings-header">
        <button className="back-button" onClick={handleBack}>
          ← 返回仪表盘
        </button>
        <h1>设置</h1>
      </div>
      <div className="settings-section">
        <h2>账户设置</h2>
        <div className="settings-option">
          <button className="logout-button" onClick={handleLogout}>
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 