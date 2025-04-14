import React, { useState, useEffect } from 'react';
import { Modal, Typography, Tabs, Image, Descriptions, Tag, Spin } from 'antd';
import styled from 'styled-components';
import MathRenderer from '../common/MathRenderer';
import { getValidImageUrl, markBlobUrlInvalid, buildBackendImageUrl } from '../../utils/imageUtils';
import config from '../../config';

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
 * 错题图片组件 - 处理单个错题的图片显示
 * 使用独立的状态管理每个错题的图片URL
 * @param {Object} props - 组件属性
 * @param {Object} props.question - 错题数据
 * @returns {JSX.Element}
 */
const QuestionImage = ({ question }) => {
  // 初始化状态
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  // 当错题变化时重置状态
  useEffect(() => {
    if (question) {
      const blobUrl = question.image_url;
      const backendPath = question.backend_image_url;
      setCurrentImageUrl(getValidImageUrl(blobUrl, backendPath));
      setImageError(false);
    } else {
      setCurrentImageUrl(null);
      setImageError(false);
    }
  }, [question?.id, question?.image_url, question?.backend_image_url]);

  // 处理图片加载错误
  const handleImageError = () => {
    // 如果当前是blob URL并且加载失败，标记为无效并尝试使用后端图片
    if (currentImageUrl && currentImageUrl.startsWith('blob:')) {
      markBlobUrlInvalid(currentImageUrl);

      // 尝试使用后端图片URL
      if (question?.backend_image_url) {
        const backendUrl = buildBackendImageUrl(question.backend_image_url);
        setCurrentImageUrl(backendUrl);
        return;
      }
    }

    // 如果后端图片也加载失败或不存在，显示错误状态
    setImageError(true);
  };

  if (!question) {
    return null;
  }

  return (
    <ImageContainer>
      {currentImageUrl && !imageError ? (
        <Image
          src={currentImageUrl}
          alt="错题图片"
          style={{ maxHeight: '300px' }}
          onError={handleImageError}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '200px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          无图片
        </div>
      )}
    </ImageContainer>
  );
};

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
          <QuestionImage question={question} />


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

  // 使用 key 确保每次打开不同错题时组件重新渲染
  return (
    <Modal
      title="错题详情"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
      key={question?.id || 'no-question'}
    >
      <ModalContent>
        {renderContent()}
      </ModalContent>
    </Modal>
  );
};

export default DetailsModal;
