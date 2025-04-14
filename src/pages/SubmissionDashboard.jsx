import React from 'react';
import { Card, Typography, Button, Empty, Divider, Progress, List, Space } from 'antd';
import styled from 'styled-components';
import { FileImageOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import ImageUploader from '../components/common/ImageUploader';
import SubmissionRow from '../components/submission/SubmissionRow';
import StepDetailsModal from '../components/submission/StepDetailsModal';
import DetailsModal from '../components/submission/DetailsModal';
import useSubmissionStore from '../stores/submissionStore';
import useSubmission from '../hooks/useSubmission';
import useMultipleUpload from '../hooks/useMultipleUpload';

const { Title, Text } = Typography;

const PageContainer = styled.div`
  padding: 24px;
`;

const UploadContainer = styled.div`
  margin-bottom: 24px;
`;

const QueueContainer = styled.div`
  margin-top: 16px;
  margin-bottom: 24px;
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 4px;
`;

const QueueHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const QueueItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const SubmissionsContainer = styled.div`
  margin-top: 24px;
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

/**
 * 错题提交页面
 * @returns {JSX.Element}
 */
const SubmissionDashboard = () => {
  // 从store获取提交列表和方法
  const {
    submissions,
    clearSubmissions,
    getSubmission,
    removeSubmission
  } = useSubmissionStore();

  // 使用自定义Hook处理提交流程
  const {
    stepDetailsVisible,
    detailsVisible,
    currentStep,
    currentSubmissionId,
    handleImageUpload,
    handleStepClick,
    handleDetailsClick,
    closeStepDetails,
    closeDetails,
    handleEdit,
    handleRetry
  } = useSubmission();

  // 使用多图片上传Hook
  const {
    addToQueue,
    clearQueue,
    uploadQueue,
    isProcessing,
    completedCount,
    totalCount,
    progress
  } = useMultipleUpload(handleImageUpload);

  // 获取当前选中的提交
  const currentSubmission = currentSubmissionId ? getSubmission(currentSubmissionId) : null;

  // 获取当前步骤的状态、数据和错误
  const currentStepStatus = currentSubmission?.steps[currentStep];
  const currentStepData = currentSubmission?.data[currentStep];
  const currentStepError = currentSubmission?.errors[currentStep];

  // 处理清空所有提交
  const handleClearAll = () => {
    clearSubmissions();
  };

  // 处理删除提交
  const handleRemoveSubmission = (submissionId) => {
    removeSubmission(submissionId);
  };

  // 处理多图片上传
  const handleMultipleImageUpload = (file) => {
    // 如果是多选，将所有文件添加到队列
    if (file instanceof FileList || Array.isArray(file)) {
      addToQueue(file);
      return;
    }

    // 单个文件直接上传
    return handleImageUpload(file);
  };

  return (
    <PageContainer>
      <Title level={2}>错题提交</Title>

      <Card>
        <UploadContainer>
          <Title level={4}>上传错题图片</Title>
          <Text type="secondary">支持JPG、PNG格式的图片，大小不超过5MB，可以一次选择或拖拽多张图片</Text>
          <ImageUploader onUpload={handleMultipleImageUpload} multiple={true} />

          {/* 上传队列显示 */}
          {totalCount > 0 && (
            <QueueContainer>
              <QueueHeader>
                <Title level={5}>上传队列 ({completedCount}/{totalCount})</Title>
                {uploadQueue.length > 0 && (
                  <Button size="small" onClick={clearQueue} disabled={isProcessing}>清空队列</Button>
                )}
              </QueueHeader>

              <Progress percent={progress} status={isProcessing ? "active" : "normal"} />

              {uploadQueue.length > 0 && (
                <List
                  size="small"
                  dataSource={uploadQueue}
                  renderItem={(file, index) => (
                    <QueueItem>
                      {index === 0 && isProcessing ? (
                        <LoadingOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                      ) : (
                        <FileImageOutlined style={{ marginRight: 8 }} />
                      )}
                      <Text ellipsis style={{ flex: 1 }}>{file.name}</Text>
                      <Text type="secondary">{(file.size / (1024 * 1024)).toFixed(2)} MB</Text>
                    </QueueItem>
                  )}
                />
              )}

              {completedCount > 0 && uploadQueue.length === 0 && !isProcessing && (
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Text>所有图片已上传完成</Text>
                </Space>
              )}
            </QueueContainer>
          )}
        </UploadContainer>

        <Divider>错题提交列表</Divider>

        <SubmissionsContainer>
          {submissions.length > 0 ? (
            <>
              {submissions.map((submission, index) => (
                <SubmissionRow
                  key={submission.id}
                  rowNumber={index + 1}
                  imageUrl={submission.imageUrl}
                  data={submission.data}
                  steps={submission.steps}
                  onStepClick={(stepName) => handleStepClick(stepName, submission.id)}
                  onDetailsClick={() => handleDetailsClick(submission.id)}
                />
              ))}

              <ActionContainer>
                <Button
                  type="primary"
                  danger
                  onClick={handleClearAll}
                >
                  清空所有
                </Button>
              </ActionContainer>
            </>
          ) : (
            <Empty
              description="暂无错题提交"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </SubmissionsContainer>
      </Card>

      {/* 步骤详情弹窗 */}
      <StepDetailsModal
        visible={stepDetailsVisible}
        onClose={closeStepDetails}
        stepName={currentStep}
        stepStatus={currentStepStatus}
        data={currentStepData}
        error={currentStepError}
        onEdit={handleEdit}
        onRetry={handleRetry}
      />

      {/* 错题详情弹窗 */}
      <DetailsModal
        visible={detailsVisible}
        onClose={closeDetails}
        question={currentSubmission?.questionId ? {
          id: currentSubmission.questionId,
          content: currentSubmission?.data?.ocr?.text,
          answer: currentSubmission?.data?.answer?.text,
          image_url: currentSubmission?.imageUrl,
          backend_image_url: currentSubmission?.data?.ocr?.image_url,
          created_at: currentSubmission?.createdAt
        } : null}
        solutionData={currentSubmission?.data?.solving}
        knowledgeData={currentSubmission?.data?.knowledgeMarks}
      />
    </PageContainer>
  );
};

export default SubmissionDashboard;