import React from 'react';
import { Tooltip } from 'antd';
import styled from 'styled-components';
import { 
  CheckCircleFilled, 
  CloseCircleFilled, 
  LoadingOutlined, 
  QuestionCircleOutlined 
} from '@ant-design/icons';

// 步骤状态枚举
export const STEP_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
  DISABLED: 'disabled'
};

// 样式组件
const StepContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.5 : 1};
`;

const StepIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  
  .success-icon {
    color: #52c41a;
  }
  
  .failed-icon {
    color: #f5222d;
  }
  
  .pending-icon {
    color: #1890ff;
  }
  
  .processing-icon {
    color: #1890ff;
  }
  
  .disabled-icon {
    color: #d9d9d9;
  }
`;

const StepLine = styled.div`
  flex: 1;
  height: 2px;
  background-color: ${props => {
    switch (props.$status) {
      case STEP_STATUS.SUCCESS:
        return '#52c41a';
      case STEP_STATUS.FAILED:
        return '#f5222d';
      case STEP_STATUS.PROCESSING:
        return '#1890ff';
      default:
        return '#d9d9d9';
    }
  }};
  margin: 0 8px;
`;

/**
 * 步骤指示器组件
 * @param {Object} props - 组件属性
 * @param {string} props.status - 步骤状态 (pending, processing, success, failed, disabled)
 * @param {string} props.label - 步骤标签
 * @param {Function} props.onClick - 点击事件处理函数
 * @param {boolean} props.showLine - 是否显示连接线
 * @param {string} props.tooltipTitle - 提示文本
 * @returns {JSX.Element}
 */
const StepIndicator = ({ 
  status = STEP_STATUS.PENDING, 
  label = '', 
  onClick, 
  showLine = true,
  tooltipTitle = ''
}) => {
  // 根据状态渲染图标
  const renderIcon = () => {
    switch (status) {
      case STEP_STATUS.SUCCESS:
        return <CheckCircleFilled className="success-icon" />;
      case STEP_STATUS.FAILED:
        return <CloseCircleFilled className="failed-icon" />;
      case STEP_STATUS.PROCESSING:
        return <LoadingOutlined className="processing-icon" />;
      case STEP_STATUS.DISABLED:
        return <QuestionCircleOutlined className="disabled-icon" />;
      default:
        return <QuestionCircleOutlined className="pending-icon" />;
    }
  };

  const isDisabled = status === STEP_STATUS.DISABLED;
  
  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  return (
    <>
      <Tooltip title={tooltipTitle || label}>
        <StepContainer 
          onClick={handleClick} 
          $disabled={isDisabled}
          data-testid={`step-indicator-${label}`}
        >
          <StepIcon>
            {renderIcon()}
          </StepIcon>
          {label}
        </StepContainer>
      </Tooltip>
      
      {showLine && <StepLine $status={status} />}
    </>
  );
};

export default StepIndicator;
