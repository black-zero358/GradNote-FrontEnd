import React from 'react';
import { Card, Select, Spin, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;
const { Option } = Select;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.09);
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

/**
 * 图表容器组件
 * @param {Object} props
 * @param {string} props.title - 图表标题
 * @param {React.ReactNode} props.children - 子组件（图表）
 * @param {boolean} props.loading - 加载状态
 * @param {Function} props.onTimeRangeChange - 时间范围变更处理函数
 * @param {string} props.timeRange - 选中的时间范围
 * @returns {JSX.Element}
 */
const ChartBox = ({ 
  title, 
  children, 
  loading = false, 
  onTimeRangeChange,
  timeRange = 'week' 
}) => {
  return (
    <StyledCard>
      <ChartHeader>
        <Title level={4}>{title}</Title>
        {onTimeRangeChange && (
          <Select 
            value={timeRange} 
            onChange={onTimeRangeChange}
            style={{ width: 120 }}
          >
            <Option value="day">今日</Option>
            <Option value="week">本周</Option>
            <Option value="month">本月</Option>
            <Option value="year">全年</Option>
          </Select>
        )}
      </ChartHeader>
      
      {loading ? (
        <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </div>
      ) : (
        children
      )}
    </StyledCard>
  );
};

export default ChartBox; 