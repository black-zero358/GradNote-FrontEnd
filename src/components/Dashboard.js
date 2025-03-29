import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/auth';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell
} from 'recharts';
import './Dashboard.css';
import { getNewQuestionsCount, getNewKnowledgeCount } from '../api/dashboard';

const Dashboard = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState([]);
  const [knowledgeData, setKnowledgeData] = useState([]);
  const [knowledgeRatio, setKnowledgeRatio] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [timeRange, setTimeRange] = useState('weekly');
  const [knowledgeTimeRange, setKnowledgeTimeRange] = useState('weekly');
  const [errorMessage, setErrorMessage] = useState('');
  const [knowledgeError, setKnowledgeError] = useState('');
  
  // 检查用户是否已认证
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // 获取错题数据
  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        setErrorMessage('');
        const newQuestionsData = await getNewQuestionsCount(timeRange);
        if (Array.isArray(newQuestionsData) && newQuestionsData.length > 0) {
          setQuestionData(newQuestionsData);
        } else {
          setQuestionData([]);
          setErrorMessage('暂无数据');
        }
      } catch (error) {
        console.error('获取数据失败', error);
        setErrorMessage(error.message || '获取数据失败，请检查网络连接');
        if (error.response?.status === 401 || error.detail === '无法验证凭据') {
          logout();
          navigate('/login');
        }
      }
    };
    
    fetchQuestionData();
  }, [timeRange, logout, navigate]);

  // 获取知识点数据
  useEffect(() => {
    const fetchKnowledgeData = async () => {
      try {
        setKnowledgeError('');
        const newKnowledgeData = await getNewKnowledgeCount(knowledgeTimeRange);
        if (Array.isArray(newKnowledgeData) && newKnowledgeData.length > 0) {
          setKnowledgeData(newKnowledgeData);
        } else {
          setKnowledgeData([]);
          setKnowledgeError('暂无数据');
        }
      } catch (error) {
        console.error('获取知识点数据失败', error);
        setKnowledgeError(error.message || '获取数据失败，请检查网络连接');
        if (error.response?.status === 401 || error.detail === '无法验证凭据') {
          logout();
          navigate('/login');
        }
      }
    };
    
    fetchKnowledgeData();
  }, [knowledgeTimeRange, logout, navigate]);
  
  // 处理时间范围变化
  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value.toLowerCase());
  };

  // 处理知识点时间范围变化
  const handleKnowledgeTimeRangeChange = (e) => {
    setKnowledgeTimeRange(e.target.value.toLowerCase());
  };

  // 计算知识点总数
  const totalKnowledgePoints = knowledgeRatio.reduce((sum, item) => sum + item.value, 0);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // 处理侧边栏折叠
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  // 打开设置弹窗
  const openSettings = () => {
    setShowSettings(true);
  };
  
  // 关闭设置弹窗
  const closeSettings = () => {
    setShowSettings(false);
  };
  
  return (
    <div className="dashboard-container">
      {/* 左侧导航 */}
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="logo">
          <h2>
            <span className="icon">📘</span>
            {!collapsed && 'GradNote'}
          </h2>
        </div>
        
        <nav className="nav-menu">
          <ul>
            <li className="active">
              <span className="icon">📊</span>
              {!collapsed && '仪表盘'}
            </li>
            <li>
              <span className="icon">📝</span>
              {!collapsed && '错题提交'}
            </li>
            <li>
              <span className="icon">✅</span>
              {!collapsed && '知识点审核'}
            </li>
            <li>
              <span className="icon">📚</span>
              {!collapsed && '错题列表'}
            </li>
            <li>
              <span className="icon">📋</span>
              {!collapsed && '知识点列表'}
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button className="help-button">
            <span className="icon">❓</span>
            {!collapsed && 'Help'}
          </button>
          <button className="settings-button" onClick={openSettings}>
            <span className="icon">⚙️</span>
            {!collapsed && 'Setting'}
          </button>
          <button className="collapse-button" onClick={toggleSidebar}>
            <span className="icon">{collapsed ? '➡️' : '⬅️'}</span>
          </button>
        </div>
      </div>
      
      {/* 主内容区 */}
      <div className={`main-content ${collapsed ? 'expanded' : ''}`}>
        {/* 图表区域 */}
        <div className="charts-container">
          {/* 新增错题数量图表 */}
          <div className="chart-box">
            <div className="chart-header">
              <h3>
                <span className="chart-icon">📈</span>
                新增错题数量
              </h3>
              <select value={timeRange} onChange={handleTimeRangeChange}>
                <option value="weekly">每周</option>
                <option value="monthly">每月</option>
                <option value="yearly">每年</option>
              </select>
            </div>
            <div className="chart-subtitle">Linear, Last {timeRange === 'weekly' ? '7 days' : timeRange === 'monthly' ? '30 days' : '365 days'}</div>
            <div className="chart-content">
              <LineChart
                width={500}
                height={300}
                data={questionData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="高数" stroke="#8884d8" />
                <Line type="monotone" dataKey="线代" stroke="#FF6B6B" />
                <Line type="monotone" dataKey="概率论" stroke="#4ECDC4" />
              </LineChart>
            </div>
          </div>
          
          {/* 新增知识点数量图表 */}
          <div className="chart-box">
            <div className="chart-header">
              <h3>
                <span className="chart-icon">📊</span>
                新增知识点数量
              </h3>
              <select value={knowledgeTimeRange} onChange={handleKnowledgeTimeRangeChange}>
                <option value="weekly">每周</option>
                <option value="monthly">每月</option>
                <option value="yearly">每年</option>
              </select>
            </div>
            <div className="chart-subtitle">
              Linear, Last {knowledgeTimeRange === 'weekly' ? '7 days' : knowledgeTimeRange === 'monthly' ? '30 days' : '365 days'}
            </div>
            {knowledgeError ? (
              <div className="error-message">{knowledgeError}</div>
            ) : (
              <div className="chart-content">
                <LineChart
                  width={500}
                  height={300}
                  data={knowledgeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="高数" stroke="#8884d8" />
                  <Line type="monotone" dataKey="线代" stroke="#FF6B6B" />
                  <Line type="monotone" dataKey="概率论" stroke="#4ECDC4" />
                </LineChart>
              </div>
            )}
          </div>
          
          {/* 知识点占比 */}
          <div className="chart-box ratio-chart">
            <div className="chart-header">
              <h3>
                <span className="chart-icon">🔄</span>
                知识点占比
              </h3>
              <select defaultValue="高数">
                <option value="高数">高数</option>
                <option value="线代">线代</option>
                <option value="概率论">概率论</option>
              </select>
            </div>
            <div className="chart-content pie-chart-content">
              <PieChart width={400} height={300}>
                <Pie
                  data={knowledgeRatio}
                  cx={200}
                  cy={150}
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {knowledgeRatio.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              <div className="pie-center">
                <div className="pie-total">{totalKnowledgePoints}</div>
                <div className="pie-label">知识点总数</div>
              </div>
              <div className="pie-legend">
                {knowledgeRatio.map((entry, index) => (
                  <div key={index} className="legend-item">
                    <div className="color-box" style={{ backgroundColor: entry.color }}></div>
                    <div className="legend-name">{entry.name}</div>
                    <div className="legend-value">{entry.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 设置弹窗 */}
      {showSettings && (
        <div className="settings-modal-overlay">
          <div className="settings-modal">
            <div className="settings-header">
              <h2>设置</h2>
              <button className="close-button" onClick={closeSettings}>×</button>
            </div>
            <div className="settings-content">
              <div className="settings-section">
                <h3>账户设置</h3>
                <div className="settings-option">
                  <button className="logout-button" onClick={handleLogout}>
                    退出登录
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 