import React from 'react';
import { Card, Select, Spin, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;
const { Option } = Select;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #f0f0f0;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const TitleWrapper = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
`;

/**
 * 图表容器组件
 * @param {Object} props
 * @param {React.ReactNode|string} props.title - 图表标题
 * @param {React.ReactNode} props.children - 子组件（图表）
 * @param {boolean} props.loading - 加载状态
 * @param {Function} props.onTimeRangeChange - 时间范围变更处理函数
 * @param {string} props.timeRange - 选中的时间范围
 * @param {React.ReactNode} props.extra - 额外的控件
 * @returns {JSX.Element}
 */
const ChartBox = ({ 
  title, 
  children, 
  loading = false, 
  onTimeRangeChange,
  timeRange = 'week',
  extra
}) => {
  return (
    <StyledCard bodyStyle={{ padding: '16px 20px' }}>
      <ChartHeader>
        <TitleWrapper>
          {typeof title === 'string' ? title : title}
        </TitleWrapper>
        
        <div>
          {extra || (onTimeRangeChange && (
            <Select 
              value={timeRange} 
              onChange={onTimeRangeChange}
              style={{ width: 100 }}
              size="small"
              bordered={false}
              dropdownMatchSelectWidth={false}
            >
              <Option value="day">今日</Option>
              <Option value="week">Weekly</Option>
              <Option value="month">Monthly</Option>
              <Option value="year">Yearly</Option>
            </Select>
          ))}
        </div>
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