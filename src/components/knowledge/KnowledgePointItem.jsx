import React from 'react';
import { Button, Tooltip } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';

// 不需要从Typography导入组件

const KnowledgePointContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
`;

const KnowledgePointText = styled.div`
  flex: 1;
  margin-right: 16px;
  white-space: pre-wrap;
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
 * @param {Function} props.onCancelConfirm - 取消确认回调
 * @param {Function} props.onCancelReject - 取消拒绝回调
 * @returns {JSX.Element}
 */
const KnowledgePointItem = ({
  knowledgePoint,
  isConfirmed,
  isRejected,
  onConfirm,
  onReject,
  onCancelConfirm,
  onCancelReject
}) => {
  // 构建知识点完整文本
  const getKnowledgePointFullText = () => {
    let text = `${knowledgePoint.subject} > ${knowledgePoint.chapter} > ${knowledgePoint.section}`;

    if (knowledgePoint.item) {
      text += ` > ${knowledgePoint.item}`;
    }

    if (knowledgePoint.details) {
      text += `\n\n${knowledgePoint.details}`;
    }

    return text;
  };

  return (
    <KnowledgePointContainer>
      <KnowledgePointText>
        {getKnowledgePointFullText()}
      </KnowledgePointText>

      <ActionButtons>
        {isConfirmed ? (
          <Tooltip title="点击取消标记">
            <Button
              type="primary"
              shape="circle"
              icon={<CheckCircleOutlined />}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              onClick={onCancelConfirm}
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
          <Tooltip title="点击取消放弃">
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<CloseCircleOutlined />}
              onClick={onCancelReject}
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
