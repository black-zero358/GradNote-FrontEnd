import React from 'react';
import { Button, Tooltip, Modal, Input, Form } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
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
 * @param {Function} props.onEdit - 编辑知识点回调
 * @param {boolean} props.readOnly - 是否只读模式，不显示操作按钮
 * @returns {JSX.Element}
 */
const KnowledgePointItem = ({
  knowledgePoint,
  isConfirmed,
  isRejected,
  onConfirm,
  onReject,
  onCancelConfirm,
  onCancelReject,
  onEdit,
  readOnly = false
}) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  // 不需要单独的状态变量，直接使用 form 管理编辑状态
  const [form] = Form.useForm();
  // 打开编辑模态框
  const showEditModal = () => {
    form.setFieldsValue({
      subject: knowledgePoint.subject,
      chapter: knowledgePoint.chapter,
      section: knowledgePoint.section,
      item: knowledgePoint.item || '',
      details: knowledgePoint.details || ''
    });
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 保存编辑的知识点
  const handleOk = () => {
    form.validateFields().then(values => {
      const updatedKnowledgePoint = {
        ...knowledgePoint,
        ...values
      };
      onEdit(updatedKnowledgePoint);
      setIsModalVisible(false);
    });
  };

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

      {!readOnly && (
        <ActionButtons>
          <Tooltip title="编辑知识点">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              style={{ marginRight: 8 }}
              onClick={showEditModal}
            />
          </Tooltip>

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
      )}

      <Modal
        title="编辑知识点"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            subject: knowledgePoint.subject,
            chapter: knowledgePoint.chapter,
            section: knowledgePoint.section,
            item: knowledgePoint.item || '',
            details: knowledgePoint.details || ''
          }}
        >
          <Form.Item
            name="subject"
            label="科目"
            rules={[{ required: true, message: '请输入科目' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="chapter"
            label="章节"
            rules={[{ required: true, message: '请输入章节' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="section"
            label="小节"
            rules={[{ required: true, message: '请输入小节' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="item"
            label="条目"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="details"
            label="详细描述"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </KnowledgePointContainer>
  );
};

export default KnowledgePointItem;
