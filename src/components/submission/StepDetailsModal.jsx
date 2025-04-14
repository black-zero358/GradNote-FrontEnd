import React, { useState } from 'react';
import { Modal, Typography, Input, Button, Alert, Spin, Tabs } from 'antd';
import styled from 'styled-components';
import { STEP_STATUS } from '../common/StepIndicator';
import MathRenderer from '../common/MathRenderer';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

// 样式组件
const ModalContent = styled.div`
  max-height: 60vh;
  overflow-y: auto;
`;

const ErrorContainer = styled.div`
  margin-top: 16px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const ActionContainer = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
`;

/**
 * 步骤详情弹窗组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.visible - 是否可见
 * @param {Function} props.onClose - 关闭回调
 * @param {string} props.stepName - 步骤名称
 * @param {string} props.stepStatus - 步骤状态
 * @param {Object} props.data - 步骤数据
 * @param {Object} props.error - 错误信息
 * @param {Function} props.onEdit - 编辑回调
 * @param {Function} props.onRetry - 重试回调
 * @returns {JSX.Element}
 */
const StepDetailsModal = ({
  visible,
  onClose,
  stepName,
  stepStatus,
  data,
  error,
  onEdit,
  onRetry
}) => {
  const [editValue, setEditValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // 获取步骤标题
  const getStepTitle = () => {
    switch (stepName) {
      case 'ocr':
        return 'OCR 文本识别';
      case 'answer':
        return '答案识别';
      case 'knowledge':
        return '相关知识点';
      case 'solving':
        return '解题过程';
      case 'knowledgeMarks':
        return '知识点标记列表';
      default:
        return '步骤详情';
    }
  };

  // 处理编辑按钮点击
  const handleEditClick = () => {
    // 设置初始编辑值
    if (stepName === 'ocr' && data?.text) {
      setEditValue(data.text);
    } else if (stepName === 'answer' && data?.text) {
      setEditValue(data.text);
    }

    setIsEditing(true);
  };

  // 处理保存编辑
  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit(stepName, editValue);
    }
    setIsEditing(false);
  };

  // 处理取消编辑
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue('');
  };

  // 处理重试
  const handleRetry = () => {
    if (onRetry) {
      onRetry(stepName);
    }
  };

  // 渲染内容
  const renderContent = () => {
    // 加载中状态
    if (stepStatus === STEP_STATUS.PROCESSING) {
      // 判断是否是LLM相关操作
      const isLLMOperation = ['knowledge', 'solving', 'knowledgeMarks'].includes(stepName);

      return (
        <LoadingContainer>
          <Spin tip={isLLMOperation ? "处理中(可能需要一到两分钟)..." : "处理中..."} />
          {isLLMOperation && (
            <Alert
              style={{ marginTop: 16 }}
              message="提示"
              description="该操作需要调用AI模型，可能需要一到两分钟的时间才能完成。请耐心等待。"
              type="info"
              showIcon
            />
          )}
        </LoadingContainer>
      );
    }

    // 错误状态
    if (stepStatus === STEP_STATUS.FAILED) {
      return (
        <ErrorContainer>
          <Alert
            message="处理失败"
            description={error?.message || '未知错误'}
            type="error"
            showIcon
          />
          <ActionContainer>
            <Button type="primary" onClick={handleRetry}>
              重试
            </Button>
          </ActionContainer>
        </ErrorContainer>
      );
    }

    // 编辑状态
    if (isEditing) {
      return (
        <>
          <TextArea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            rows={10}
            placeholder={`请输入${getStepTitle()}内容`}
          />
          <ActionContainer>
            <Button onClick={handleCancelEdit} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" onClick={handleSaveEdit}>
              保存
            </Button>
          </ActionContainer>
        </>
      );
    }

    // 成功状态 - 根据不同步骤显示不同内容
    switch (stepName) {
      case 'ocr':
        return (
          <>
            <div className="solution-content">
              <MathRenderer content={data?.text || '无识别文本'} />
            </div>
            <ActionContainer>
              <Button type="primary" onClick={handleEditClick}>
                编辑
              </Button>
            </ActionContainer>
          </>
        );

      case 'answer':
        return (
          <>
            <div className="solution-content">
              <MathRenderer content={data?.text || '无识别答案'} />
            </div>
            <ActionContainer>
              <Button type="primary" onClick={handleEditClick}>
                编辑
              </Button>
            </ActionContainer>
          </>
        );

      case 'knowledge':
        if (!data?.categories || data.categories.length === 0) {
          return <Text>未找到相关知识点</Text>;
        }
        return (
          <ul>
            {data.categories.map((category, index) => (
              <li key={index}>
                <Text>{`${category.subject} > ${category.chapter} > ${category.section}`}</Text>
              </li>
            ))}
          </ul>
        );

      case 'solving':
        if (!data?.data) {
          return <Text>无解题数据</Text>;
        }
        return (
          <Tabs defaultActiveKey="solution">
            <TabPane tab="解题过程" key="solution">
              <div className="solution-content">
                <MathRenderer content={data.data.solution || '无解题过程'} />
              </div>
            </TabPane>
            <TabPane tab="审核结果" key="review">
              <Alert
                message={data.data.review_passed ? '审核通过' : '审核未通过'}
                description={data.data.review_reason || '无审核原因'}
                type={data.data.review_passed ? 'success' : 'warning'}
                showIcon
              />
            </TabPane>
          </Tabs>
        );

      case 'knowledgeMarks':
        if (!data?.existing_knowledge_points && !data?.new_knowledge_points) {
          return <Text>无知识点标记</Text>;
        }
        return (
          <Tabs defaultActiveKey="existing">
            <TabPane tab="已有知识点" key="existing">
              {data.existing_knowledge_points && data.existing_knowledge_points.length > 0 ? (
                <ul>
                  {data.existing_knowledge_points.map((point, index) => (
                    <li key={index}>
                      <Text>{`${point.subject} > ${point.chapter} > ${point.section} > ${point.item}`}</Text>
                    </li>
                  ))}
                </ul>
              ) : (
                <Text>无已有知识点</Text>
              )}
            </TabPane>
            <TabPane tab="新知识点" key="new">
              {data.new_knowledge_points && data.new_knowledge_points.length > 0 ? (
                <ul>
                  {data.new_knowledge_points.map((point, index) => (
                    <li key={index}>
                      <Text>{`${point.subject} > ${point.chapter} > ${point.section} > ${point.item}`}</Text>
                    </li>
                  ))}
                </ul>
              ) : (
                <Text>无新知识点</Text>
              )}
            </TabPane>
          </Tabs>
        );

      default:
        return <Text>无数据</Text>;
    }
  };

  return (
    <Modal
      title={getStepTitle()}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
    >
      <ModalContent>
        {renderContent()}
      </ModalContent>
    </Modal>
  );
};

export default StepDetailsModal;
