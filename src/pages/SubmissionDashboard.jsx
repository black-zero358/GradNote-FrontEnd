import React, { useEffect } from 'react';
import { Card, Typography, Button, Empty, Divider } from 'antd';
import styled from 'styled-components';
import { PlusOutlined } from '@ant-design/icons';
import ImageUploader from '../components/common/ImageUploader';
import SubmissionRow from '../components/submission/SubmissionRow';
import StepDetailsModal from '../components/submission/StepDetailsModal';
import DetailsModal from '../components/submission/DetailsModal';
import useSubmissionStore from '../stores/submissionStore';
import useSubmission from '../hooks/useSubmission';

const { Title, Text } = Typography;

const PageContainer = styled.div`
  padding: 24px;
`;

const UploadContainer = styled.div`
  margin-bottom: 24px;
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

  return (
    <PageContainer>
      <Title level={2}>错题提交</Title>

      <Card>
        <UploadContainer>
          <Title level={4}>上传错题图片</Title>
          <Text type="secondary">支持JPG、PNG格式的图片，大小不超过5MB</Text>
          <ImageUploader onUpload={handleImageUpload} />
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
          created_at: currentSubmission?.createdAt
        } : null}
        solutionData={currentSubmission?.data?.solving}
        knowledgeData={currentSubmission?.data?.knowledgeMarks}
      />
    </PageContainer>
  );
};

export default SubmissionDashboard;