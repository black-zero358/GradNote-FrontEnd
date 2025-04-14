import React from 'react';
import { Modal, Typography, Tabs, Image, Descriptions, Tag, Spin } from 'antd';
import styled from 'styled-components';
import MathRenderer from '../common/MathRenderer';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 样式组件
const ModalContent = styled.div`
  max-height: 70vh;
  overflow-y: auto;
`;

const ImageContainer = styled.div`
  margin-bottom: 16px;
  text-align: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

/**
 * 错题详情弹窗组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.visible - 是否可见
 * @param {Function} props.onClose - 关闭回调
 * @param {Object} props.question - 错题数据
 * @param {Object} props.solutionData - 解题数据
 * @param {Object} props.knowledgeData - 知识点数据
 * @param {boolean} props.loading - 是否加载中
 * @returns {JSX.Element}
 */
const DetailsModal = ({
  visible,
  onClose,
  question,
  solutionData,
  knowledgeData,
  loading = false
}) => {
  // 渲染内容
  const renderContent = () => {
    if (loading) {
      return (
        <LoadingContainer>
          <Spin tip="加载中..." />
        </LoadingContainer>
      );
    }

    if (!question) {
      return <Text>无错题数据</Text>;
    }

    return (
      <Tabs defaultActiveKey="question">
        <TabPane tab="错题信息" key="question">
          {question.image_url && (
            <ImageContainer>
              <Image
                src={question.image_url}
                alt="错题图片"
                style={{ maxHeight: '300px' }}
              />
            </ImageContainer>
          )}

          <Descriptions bordered column={1}>
            <Descriptions.Item label="题目内容">
              <div className="solution-content">
                <MathRenderer content={question.content || '无内容'} />
              </div>
            </Descriptions.Item>

            {question.subject && (
              <Descriptions.Item label="科目">
                <Tag color="blue">{question.subject}</Tag>
              </Descriptions.Item>
            )}

            {question.answer && (
              <Descriptions.Item label="答案">
                <div className="solution-content">
                  <MathRenderer content={question.answer} />
                </div>
              </Descriptions.Item>
            )}

            {question.remark && (
              <Descriptions.Item label="备注">
                {question.remark}
              </Descriptions.Item>
            )}

            <Descriptions.Item label="创建时间">
              {question.created_at ? new Date(question.created_at).toLocaleString() : '未知'}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>

        <TabPane tab="解题过程" key="solution">
          {solutionData?.data ? (
            <>
              <Title level={4}>解题过程</Title>
              <div className="solution-content">
                <MathRenderer content={solutionData.data.solution || '无解题过程'} />
              </div>

              <Title level={4}>审核结果</Title>
              <Paragraph>
                <Tag color={solutionData.data.review_passed ? 'success' : 'warning'}>
                  {solutionData.data.review_passed ? '审核通过' : '审核未通过'}
                </Tag>
                {solutionData.data.review_reason && (
                  <Text type="secondary">{solutionData.data.review_reason}</Text>
                )}
              </Paragraph>
            </>
          ) : (
            <Text>无解题数据</Text>
          )}
        </TabPane>

        <TabPane tab="知识点" key="knowledge">
          {knowledgeData ? (
            <>
              <Title level={4}>已有知识点</Title>
              {knowledgeData.existing_knowledge_points && knowledgeData.existing_knowledge_points.length > 0 ? (
                <ul>
                  {knowledgeData.existing_knowledge_points.map((point, index) => (
                    <li key={index}>
                      <Text>{`${point.subject} > ${point.chapter} > ${point.section} > ${point.item}`}</Text>
                      {point.details && <Paragraph type="secondary">{point.details}</Paragraph>}
                    </li>
                  ))}
                </ul>
              ) : (
                <Text>无已有知识点</Text>
              )}

              <Title level={4}>新知识点</Title>
              {knowledgeData.new_knowledge_points && knowledgeData.new_knowledge_points.length > 0 ? (
                <ul>
                  {knowledgeData.new_knowledge_points.map((point, index) => (
                    <li key={index}>
                      <Text>{`${point.subject} > ${point.chapter} > ${point.section} > ${point.item}`}</Text>
                      {point.details && <Paragraph type="secondary">{point.details}</Paragraph>}
                    </li>
                  ))}
                </ul>
              ) : (
                <Text>无新知识点</Text>
              )}
            </>
          ) : (
            <Text>无知识点数据</Text>
          )}
        </TabPane>
      </Tabs>
    );
  };

  return (
    <Modal
      title="错题详情"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      <ModalContent>
        {renderContent()}
      </ModalContent>
    </Modal>
  );
};

export default DetailsModal;
