import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/auth';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState([]);
  const [knowledgeData, setKnowledgeData] = useState([]);
  const [knowledgeRatio, setKnowledgeRatio] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  useEffect(() => {
    // 模拟获取数据
    // 实际项目中应该通过API获取
    const fetchData = async () => {
      try {
        // 在实际应用中，这里需要从API获取数据
        // const questionsRes = await api.get('/questions/stats');
        // const knowledgeRes = await api.get('/knowledge/stats');
        
        // 模拟数据
        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const mockQuestionData = weekDays.map(day => ({
          day,
          高数: Math.floor(Math.random() * 3000) + 1000,
          线代: Math.floor(Math.random() * 2000) + 500,
          概率论: Math.floor(Math.random() * 1000) + 300
        }));
        
        const mockKnowledgeData = weekDays.map(day => ({
          day,
          高数: Math.floor(Math.random() * 3000) + 1000,
          线代: Math.floor(Math.random() * 2000) + 500,
          概率论: Math.floor(Math.random() * 1000) + 300
        }));
        
        const mockKnowledgeRatio = [
          { name: 'chapter 1', value: 546, color: '#8884d8' },
          { name: 'chapter 2', value: 457, color: '#FF6B6B' },
          { name: 'chapter 3', value: 386, color: '#4ECDC4' },
          { name: 'chapter 4', value: 64, color: '#C7F464' }
        ];
        
        setQuestionData(mockQuestionData);
        setKnowledgeData(mockKnowledgeData);
        setKnowledgeRatio(mockKnowledgeRatio);
      } catch (error) {
        console.error('获取数据失败', error);
      }
    };
    
    fetchData();
  }, []);
  
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
              <select defaultValue="Weekly">
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div className="chart-subtitle">Linear, Last 7 days</div>
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
              <select defaultValue="Weekly">
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div className="chart-subtitle">Linear, Last 7 days</div>
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