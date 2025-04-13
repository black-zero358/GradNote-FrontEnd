import React from 'react';
import { Typography, Button, Space, Tooltip } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Text } = Typography;

const KnowledgePointContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
`;

const KnowledgePointText = styled(Text)`
  flex: 1;
  margin-right: 16px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ConfirmButton = styled(Button)`
  color: #52c41a;
  border-color: #52c41a;
  &:hover {
    color: #fff;
    background-color: #52c41a;
    border-color: #52c41a;
  }
`;

const RejectButton = styled(Button)`
  color: #f5222d;
  border-color: #f5222d;
  &:hover {
    color: #fff;
    background-color: #f5222d;
    border-color: #f5222d;
  }
`;

/**
 * 知识点条目组件
 * @param {Object} props - 组件属性
 * @param {Object} props.knowledgePoint - 知识点数据
 * @param {boolean} props.isConfirmed - 是否已确认
 * @param {boolean} props.isRejected - 是否已拒绝
 * @param {Function} props.onConfirm - 确认回调
 * @param {Function} props.onReject - 拒绝回调
 * @returns {JSX.Element}
 */
const KnowledgePointItem = ({ 
  knowledgePoint, 
  isConfirmed, 
  isRejected, 
  onConfirm, 
  onReject 
}) => {
  // 根据知识点类型构建显示文本
  const getKnowledgePointText = () => {
    if (knowledgePoint.item) {
      return `${knowledgePoint.subject} > ${knowledgePoint.chapter} > ${knowledgePoint.section} > ${knowledgePoint.item}`;
    } else {
      return `${knowledgePoint.subject} > ${knowledgePoint.chapter} > ${knowledgePoint.section}`;
    }
  };

  return (
    <KnowledgePointContainer>
      <KnowledgePointText>
        {getKnowledgePointText()}
      </KnowledgePointText>
      
      <ActionButtons>
        {isConfirmed ? (
          <Tooltip title="确定标记">
            <Button 
              type="primary" 
              shape="circle" 
              icon={<CheckCircleOutlined />} 
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            />
          </Tooltip>
        ) : (
          <Tooltip title="标记">
            <ConfirmButton 
              shape="circle" 
              icon={<CheckCircleOutlined />} 
              onClick={onConfirm}
              disabled={isRejected}
            />
          </Tooltip>
        )}
        
        {isRejected ? (
          <Tooltip title="已放弃标记">
            <Button 
              type="primary" 
              danger 
              shape="circle" 
              icon={<CloseCircleOutlined />} 
            />
          </Tooltip>
        ) : (
          <Tooltip title="放弃标记">
            <RejectButton 
              shape="circle" 
              icon={<CloseCircleOutlined />} 
              onClick={onReject}
              disabled={isConfirmed}
            />
          </Tooltip>
        )}
      </ActionButtons>
    </KnowledgePointContainer>
  );
};

export default KnowledgePointItem;
