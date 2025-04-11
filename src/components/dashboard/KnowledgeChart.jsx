import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Alert } from 'antd';
import ChartBox from './ChartBox';

// 饼图颜色
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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

  return (
    <ChartBox 
      title="知识点分布" 
      timeRange={timeRange} 
      onTimeRangeChange={onTimeRangeChange}
      loading={isLoading}
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data || []}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {(data || []).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}个知识点`, '数量']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartBox>
  );
};

export default KnowledgeChart; 