import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Alert, Typography, Select } from 'antd';
import ChartBox from './ChartBox';

// 饼图颜色
const COLORS = ['#8884ff', '#ff7b7b', '#48d8bc', '#cdeec0', '#aaa8d6'];

const { Text } = Typography;
const { Option } = Select;

/**
 * 知识点统计图表组件
 * @param {Object} props
 * @param {string} props.timeRange - 时间范围
 * @param {Function} props.onTimeRangeChange - 时间范围变更处理函数
 * @param {Object} props.data - 图表数据
 * @param {boolean} props.isLoading - 加载状态
 * @param {Object} props.error - 错误信息
 * @returns {JSX.Element}
 */
const KnowledgeChart = ({ 
  timeRange, 
  onTimeRangeChange, 
  data, 
  isLoading,
  error 
}) => {
  // 如果有错误，显示错误信息
  if (error) {
    return (
      <ChartBox 
        title="知识点分布" 
        timeRange={timeRange} 
        onTimeRangeChange={onTimeRangeChange}
      >
        <Alert
          message="数据加载失败"
          description={error.message || "请稍后再试"}
          type="error"
          showIcon
        />
      </ChartBox>
    );
  }
  
  // 计算知识点总数
  const totalKnowledge = data?.reduce((sum, item) => sum + item.value, 0) || 0;

  // 处理图表显示的分类
  const handleFilterChange = (value) => {
    // 这里可以根据需要添加筛选逻辑
    console.log('筛选选择:', value);
  };

  return (
    <ChartBox 
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTkgMTUuMzMzM0FIOC42NjY2N0M4LjMgMTUuMzMzM0EgOCAxMy4zMzMzQSA4IDEzLjMzMzNDNy43IDE1LjMzMzNBIDcgMTUuMzMzM0EiIHN0cm9rZT0iIzQ4ZDhiYyIgc3Ryb2tlLXdpZHRoPSIxLjMzMzMzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEzLjMzMzMgMTUuMzMzM0gxMS4zMzMzQzExLjMzMzMgMTMuMzMzMyA5LjY2NjY3IDEzLjMzMzMgOS42NjY2NyAxMS4zMzMzQzExLjY2NjcgMTEuMzMzMyAxMy4zMzMzIDkuNjY2NjcgMTMuMzMzMyA3LjY2NjY3TDE1LjMzMzMgNy42NjY2N0MxNS4zMzMzIDkuNjY2NjcgMTUuMzMzMyAxMS4zMzMzIDEzLjMzMzMgMTEuMzMzM0MxMy4zMzMzIDEzLjMzMzMgMTMuMzMzMyAxNS4zMzMzIDEzLjMzMzMgMTUuMzMzM1oiIHN0cm9rZT0iIzQ4ZDhiYyIgc3Ryb2tlLXdpZHRoPSIxLjMzMzMzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTQuNjY2NjcgMTUuMzMzM0g2LjY2NjY3QzYuNjY2NjcgMTMuMzMzMyA4LjMzMzMzIDEzLjMzMzMgOC4zMzMzMyAxMS4zMzMzQzYuMzMzMzMgMTEuMzMzMyA0LjY2NjY3IDkuNjY2NjcgNC42NjY2NyA3LjY2NjY3TDIuNjY2NjcgNy42NjY2N0MyLjY2NjY3IDkuNjY2NjcgMi42NjY2NyAxMS4zMzMzIDQuNjY2NjcgMTEuMzMzM0M0LjY2NjY3IDEzLjMzMzMgNC42NjY2NyAxNS4zMzMzIDQuNjY2NjcgMTUuMzMzM1oiIHN0cm9rZT0iIzQ4ZDhiYyIgc3Ryb2tlLXdpZHRoPSIxLjMzMzMzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTkgNy42NjY2N0M5IDcuNjY2NjcgOC4zMzMzMyA1LjY2NjY3IDkgMy42NjY2N0M5LjY2NjY3IDEuNjY2NjcgMTIuMzMzMyAwLjY2NjY2NyAxMyAwLjY2NjY2N0MxMy42NjY3IDAuNjY2NjY3IDE2LjMzMzMgMS42NjY2NyAxNyAzLjY2NjY3QzE3LjY2NjcgNS42NjY2NyAxNyA3LjY2NjY3IDE3IDcuNjY2NjciIHN0cm9rZT0iIzQ4ZDhiYyIgc3Ryb2tlLXdpZHRoPSIxLjMzMzMzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTcuNjY2NjcgNy42NjY2N0M3LjY2NjY3IDcuNjY2NjcgOC4zMzMzMyA1LjY2NjY3IDcuNjY2NjcgMy42NjY2N0M3IDEuNjY2NjcgNC4zMzMzMyAwLjY2NjY2NyAzLjY2NjY3IDAuNjY2NjY3QzMgMC42NjY2NjcgMC4zMzMzMzMgMS42NjY2NyAtMC4zMzMzMzMgMy42NjY2N0MtMSA1LjY2NjY3IC0wLjMzMzMzMyA3LjY2NjY3IC0wLjMzMzMzMyA3LjY2NjY3IiBzdHJva2U9IiM0OGQ4YmMiIHN0cm9rZS13aWR0aD0iMS4zMzMzMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==" 
            alt="Knowledge Icon" 
            style={{ marginRight: 6, width: 18, height: 18 }} 
          />
          <span>知识点占比</span>
        </div>
      }
      extra={
        <Select 
          defaultValue="高数" 
          style={{ width: 120 }} 
          onChange={handleFilterChange}
        >
          <Option value="高数">高数</Option>
          <Option value="线代">线代</Option>
          <Option value="概率论">概率论</Option>
        </Select>
      }
      loading={isLoading}
    >
      <div style={{ position: 'relative', width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data || []}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              paddingAngle={2}
              label
            >
              {(data || []).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value}`, name]} 
              labelFormatter={() => ''} 
            />
            <Legend 
              layout="vertical" 
              align="right" 
              verticalAlign="middle"
              formatter={(value, entry, index) => {
                const { payload } = entry;
                const percentage = ((payload.value / totalKnowledge) * 100).toFixed(0);
                return (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <span>{`${payload.name} ${payload.value}`}</span>
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* 中间显示总数 */}
        <div 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{totalKnowledge}</Text>
          <div>
            <Text style={{ fontSize: 14, color: '#666' }}>知识点总数</Text>
          </div>
        </div>
      </div>
    </ChartBox>
  );
};

export default KnowledgeChart; 