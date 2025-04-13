import React, { useState } from 'react';
import { Card, Typography, Button, Tabs, Empty, Spin, Alert } from 'antd';
import styled from 'styled-components';
import useKnowledgeReview from '../hooks/useKnowledgeReview';
import KnowledgePointItem from '../components/knowledge/KnowledgePointItem';
import QuestionPreview from '../components/knowledge/QuestionPreview';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const PageContainer = styled.div`
  padding: 24px;
`;

const KnowledgeSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.div`
  font-weight: bold;
  margin-bottom: 12px;
  font-size: 16px;
`;

const KnowledgeList = styled.div`
  margin-bottom: 16px;
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
`;

const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
`;

/**
 * 知识点审核页面
 * @returns {JSX.Element}
 */
const KnowledgeReviewPage = () => {
  // 使用自定义Hook获取知识点审核相关的状态和方法
  const {
    loading,
    error,
    submissionsWithKnowledge,
    confirmKnowledgePoint,
    rejectKnowledgePoint,
    cancelConfirmKnowledgePoint,
    cancelRejectKnowledgePoint,
    isKnowledgePointConfirmed,
    isKnowledgePointRejected,
    submitConfirmedKnowledgePoints
  } = useKnowledgeReview();

  // 当前选中的提交索引
  const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState(0);

  // 获取当前选中的提交
  const currentSubmission = submissionsWithKnowledge[currentSubmissionIndex];

  // 处理标签页切换
  const handleTabChange = (activeKey) => {
    setCurrentSubmissionIndex(Number(activeKey));
  };

  // 处理确认知识点
  const handleConfirmKnowledgePoint = (knowledgePointId, isExisting = true) => {
    if (currentSubmission) {
      confirmKnowledgePoint(currentSubmission.id, knowledgePointId, isExisting);
    }
  };

  // 处理拒绝知识点
  const handleRejectKnowledgePoint = (knowledgePointId, isExisting = true) => {
    if (currentSubmission) {
      rejectKnowledgePoint(currentSubmission.id, knowledgePointId, isExisting);
    }
  };

  // 处理取消确认知识点
  const handleCancelConfirmKnowledgePoint = (knowledgePointId, isExisting = true) => {
    if (currentSubmission) {
      cancelConfirmKnowledgePoint(currentSubmission.id, knowledgePointId, isExisting);
    }
  };

  // 处理取消拒绝知识点
  const handleCancelRejectKnowledgePoint = (knowledgePointId, isExisting = true) => {
    if (currentSubmission) {
      cancelRejectKnowledgePoint(currentSubmission.id, knowledgePointId, isExisting);
    }
  };

  // 处理提交确认的知识点
  const handleSubmit = () => {
    if (currentSubmission) {
      submitConfirmedKnowledgePoints(currentSubmission.id);
    }
  };

  // 渲染知识点列表
  const renderKnowledgePoints = (knowledgePoints, isExisting = true) => {
    if (!knowledgePoints || knowledgePoints.length === 0) {
      return (
        <EmptyContainer>
          <Empty description={`暂无${isExisting ? '已有' : '新'}知识点`} />
        </EmptyContainer>
      );
    }

    return (
      <KnowledgeList>
        {knowledgePoints.map((point, index) => {
          const pointId = isExisting ? point.id : point.item;
          return (
            <KnowledgePointItem
              key={`${isExisting ? 'existing' : 'new'}-${index}`}
              knowledgePoint={point}
              isConfirmed={isKnowledgePointConfirmed(currentSubmission.id, pointId, isExisting)}
              isRejected={isKnowledgePointRejected(currentSubmission.id, pointId, isExisting)}
              onConfirm={() => handleConfirmKnowledgePoint(pointId, isExisting)}
              onReject={() => handleRejectKnowledgePoint(pointId, isExisting)}
              onCancelConfirm={() => handleCancelConfirmKnowledgePoint(pointId, isExisting)}
              onCancelReject={() => handleCancelRejectKnowledgePoint(pointId, isExisting)}
            />
          );
        })}
      </KnowledgeList>
    );
  };

  // 渲染提交内容
  const renderSubmissionContent = () => {
    if (!currentSubmission) {
      return (
        <EmptyContainer>
          <Empty description="暂无需要审核的知识点" />
        </EmptyContainer>
      );
    }

    const { data } = currentSubmission;
    const ocrData = data.ocr || {};
    const knowledgeMarksData = data.knowledgeMarks || {};

    return (
      <div>
        {/* 题目预览 */}
        <QuestionPreview
          imageUrl={currentSubmission.imageUrl}
          questionText={ocrData.text}
          rowNumber={currentSubmissionIndex + 1}
        />

        {/* 已有知识点 */}
        <KnowledgeSection>
          <SectionTitle>已有知识点</SectionTitle>
          {renderKnowledgePoints(knowledgeMarksData.existing_knowledge_points, true)}
        </KnowledgeSection>

        {/* 新知识点 */}
        <KnowledgeSection>
          <SectionTitle>新知识点</SectionTitle>
          {renderKnowledgePoints(knowledgeMarksData.new_knowledge_points, false)}
        </KnowledgeSection>

        {/* 操作按钮 */}
        <ActionContainer>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
          >
            提交确认的知识点
          </Button>
        </ActionContainer>
      </div>
    );
  };

  return (
    <PageContainer>
      <Title level={2}>知识点审核</Title>

      {/* 错误提示 */}
      {error && (
        <Alert
          message="操作失败"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 加载状态 */}
      {loading && !error ? (
        <StyledCard>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">正在处理知识点...</Text>
            </div>
          </div>
        </StyledCard>
      ) : (
        <>
          {submissionsWithKnowledge.length > 0 ? (
            <Tabs
              activeKey={currentSubmissionIndex.toString()}
              onChange={handleTabChange}
              type="card"
            >
              {submissionsWithKnowledge.map((_, index) => (
                <TabPane tab={`错题 ${index + 1}`} key={index}>
                  {renderSubmissionContent()}
                </TabPane>
              ))}
            </Tabs>
          ) : (
            <StyledCard>
              <EmptyContainer>
                <Empty description="暂无需要审核的知识点" />
              </EmptyContainer>
            </StyledCard>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default KnowledgeReviewPage;