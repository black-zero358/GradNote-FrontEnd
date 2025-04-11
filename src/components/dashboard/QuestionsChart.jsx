import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Alert } from 'antd';
import ChartBox from './ChartBox';

/**
 * 错题统计图表组件
 * @param {Object} props
 * @param {string} props.timeRange - 时间范围
 * @param {Function} props.onTimeRangeChange - 时间范围变更处理函数
 * @param {Object} props.data - 图表数据
 * @param {boolean} props.isLoading - 加载状态
 * @param {Object} props.error - 错误信息
 * @returns {JSX.Element}
 */
const QuestionsChart = ({ 
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
        title="错题统计" 
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
      title="错题统计" 
      timeRange={timeRange} 
      onTimeRangeChange={onTimeRangeChange}
      loading={isLoading}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar name="已提交" dataKey="submitted" fill="#8884d8" />
          <Bar name="已解决" dataKey="solved" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </ChartBox>
  );
};

export default QuestionsChart; 