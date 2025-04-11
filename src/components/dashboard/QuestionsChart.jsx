import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

  // 数据转换为更合适的格式，添加线性key
  const formattedData = data?.map(item => ({
    ...item,
    '高数': item.submitted, // 紫色线
    '线代': Math.round(item.submitted * 0.6), // 红色线，这里为了示例用了一个比例
    '概率论': Math.round(item.submitted * 0.4), // 绿色线，这里为了示例用了一个比例
  })) || [];

  return (
    <ChartBox 
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEzLjYgMy4ySDIuNEM2LjA1MTQ4IDMuMiA5IDE2IDkgMTZTMTEuOTQ4NSAzLjIgMTMuNiAzLjIiIHN0cm9rZT0iI2ZmN2I3YiIgc3Ryb2tlLXdpZHRoPSIxLjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMi40IDEyLjhMMTMuNiAxMi44IiBzdHJva2U9IiNmZjdiN2IiIHN0cm9rZS13aWR0aD0iMS42IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEzLjYgMTIuOEgxNS4yIiBzdHJva2U9IiNmZjdiN2IiIHN0cm9rZS13aWR0aD0iMS42IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEzLjYgMFYzLjIiIHN0cm9rZT0iI2ZmN2I3YiIgc3Ryb2tlLXdpZHRoPSIxLjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMi40IDBWMy4yIiBzdHJva2U9IiNmZjdiN2IiIHN0cm9rZS13aWR0aD0iMS42IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTIuNCAxMi44SDAuOCIgc3Ryb2tlPSIjZmY3YjdiIiBzdHJva2Utd2lkdGg9IjEuNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=" 
            alt="Questions Icon" 
            style={{ marginRight: 6, width: 18, height: 18 }} 
          />
          <span>新增题目数量</span>
        </div>
      }
      timeRange={timeRange} 
      onTimeRangeChange={onTimeRangeChange}
      loading={isLoading}
    >
      <div style={{ fontSize: 10, color: '#888', marginBottom: 4 }}>
        Linear, Last 7 days
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend iconType="circle" />
          <Line 
            type="monotone" 
            dataKey="高数" 
            stroke="#8884ff" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="线代" 
            stroke="#ff7b7b" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="概率论" 
            stroke="#48d8bc" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartBox>
  );
};

export default QuestionsChart; 