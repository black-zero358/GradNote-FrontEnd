import React, { useState, useMemo } from 'react';
import { Card, Typography, Button, Tabs, Empty, Spin, Alert } from 'antd';
import styled from 'styled-components';
import useKnowledgeReview from '../hooks/useKnowledgeReview';
import KnowledgePointItem from '../components/knowledge/KnowledgePointItem';
import QuestionPreview from '../components/knowledge/QuestionPreview';
import { REVIEW_STATUS } from '../stores/submissionStore';

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
    editKnowledgePoint,
    submitConfirmedKnowledgePoints,
    startReReview
  } = useKnowledgeReview();

  // 当前选中的主标签页（待审核/已审核）
  const [activeMainTab, setActiveMainTab] = useState('pending');

  // 当前选中的提交索引
  const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState(0);

  // 按审核状态过滤提交
  const pendingReviewSubmissions = useMemo(() => {
    return submissionsWithKnowledge.filter(submission =>
      submission.reviewStatus === REVIEW_STATUS.PENDING_REVIEW ||
      submission.reviewStatus === REVIEW_STATUS.REVIEWING
    );
  }, [submissionsWithKnowledge]);

  const reviewedSubmissions = useMemo(() => {
    return submissionsWithKnowledge.filter(submission =>
      submission.reviewStatus === REVIEW_STATUS.REVIEWED
    );
  }, [submissionsWithKnowledge]);

  // 获取当前选中的提交
  const currentSubmission = activeMainTab === 'pending'
    ? pendingReviewSubmissions[currentSubmissionIndex]
    : reviewedSubmissions[currentSubmissionIndex];

  // 处理主标签页切换（待审核/已审核）
  const handleMainTabChange = (activeKey) => {
    setActiveMainTab(activeKey);
    setCurrentSubmissionIndex(0); // 重置当前选中的提交索引
  };

  // 处理子标签页切换（错题列表）
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

  // 处理编辑知识点
  const handleEditKnowledgePoint = (knowledgePointId, updatedKnowledgePoint, isExisting = true) => {
    if (currentSubmission) {
      editKnowledgePoint(currentSubmission.id, knowledgePointId, updatedKnowledgePoint, isExisting);
    }
  };

  // 处理提交确认的知识点
  const handleSubmit = () => {
    if (currentSubmission) {
      submitConfirmedKnowledgePoints(currentSubmission.id);
    }
  };

  // 处理重新审核
  const handleReReview = (submissionId) => {
    startReReview(submissionId);
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
              onEdit={(updatedKnowledgePoint) => handleEditKnowledgePoint(pointId, updatedKnowledgePoint, isExisting)}
            />
          );
        })}
      </KnowledgeList>
    );
  };

  // 渲染待审核的提交内容
  const renderPendingSubmissionContent = () => {
    if (!currentSubmission) {
      return (
        <EmptyContainer>
          <Empty description="暂无需要审核的知识点" />
        </EmptyContainer>
      );
    }

    const { data } = currentSubmission;
    const ocrData = data.ocr || {};

    // 尝试从 localStorage 中获取最新的知识点数据
    let knowledgeMarksData;
    try {
      const storageKey = 'gradnote-submissions';
      const storageData = JSON.parse(localStorage.getItem(storageKey));
      if (storageData && storageData.state && storageData.state.submissions) {
        const storageSubmission = storageData.state.submissions.find(s => s.id === currentSubmission.id);
        if (storageSubmission && storageSubmission.data && storageSubmission.data.knowledgeMarks) {
          knowledgeMarksData = storageSubmission.data.knowledgeMarks;
        }
      }
    } catch (error) {
      console.error('从 localStorage 获取知识点数据失败', error);
    }

    // 如果从 localStorage 中无法获取数据，则使用内存中的数据
    if (!knowledgeMarksData) {
      knowledgeMarksData = data.knowledgeMarks || {};
    }

    return (
      <div>
        {/* 题目预览 */}
        <QuestionPreview
          imageUrl={currentSubmission.imageUrl}
          backendImagePath={ocrData.image_url}
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

  // 渲染已审核的提交内容
  const renderReviewedSubmissionContent = () => {
    if (!currentSubmission) {
      return (
        <EmptyContainer>
          <Empty description="暂无已审核的知识点" />
        </EmptyContainer>
      );
    }

    // 尝试从 localStorage 中获取最新的数据
    let ocrData;
    try {
      const storageKey = 'gradnote-submissions';
      const storageData = JSON.parse(localStorage.getItem(storageKey));
      if (storageData && storageData.state && storageData.state.submissions) {
        const storageSubmission = storageData.state.submissions.find(s => s.id === currentSubmission.id);
        if (storageSubmission && storageSubmission.data && storageSubmission.data.ocr) {
          ocrData = storageSubmission.data.ocr;
        }
      }
    } catch (error) {
      console.error('从 localStorage 获取 OCR 数据失败', error);
    }

    // 如果从 localStorage 中无法获取数据，则使用内存中的数据
    if (!ocrData) {
      const { data } = currentSubmission;
      ocrData = data.ocr || {};
    }

    return (
      <div>
        {/* 题目预览 */}
        <QuestionPreview
          imageUrl={currentSubmission.imageUrl}
          backendImagePath={ocrData.image_url}
          questionText={ocrData.text}
          rowNumber={currentSubmissionIndex + 1}
        />

        {/* 已确认的知识点 */}
        <KnowledgeSection>
          <SectionTitle>已确认的知识点</SectionTitle>
          {renderConfirmedKnowledgePoints(currentSubmission)}
        </KnowledgeSection>

        {/* 操作按钮 */}
        <ActionContainer>
          <Button
            type="primary"
            onClick={() => handleReReview(currentSubmission.id)}
          >
            重新审核
          </Button>
        </ActionContainer>
      </div>
    );
  };

  // 渲染已确认的知识点
  const renderConfirmedKnowledgePoints = (submission) => {
    // 尝试从 localStorage 中获取最新的知识点数据
    let knowledgeMarksData;
    let confirmedKnowledgePointsData = {};

    try {
      const storageKey = 'gradnote-submissions';
      const storageData = JSON.parse(localStorage.getItem(storageKey));
      if (storageData && storageData.state && storageData.state.submissions) {
        const storageSubmission = storageData.state.submissions.find(s => s.id === submission.id);
        if (storageSubmission && storageSubmission.data) {
          if (storageSubmission.data.knowledgeMarks) {
            knowledgeMarksData = storageSubmission.data.knowledgeMarks;
          }

          // 从提交数据中获取已确认的知识点状态
          if (storageSubmission.data.confirmedKnowledgePoints) {
            confirmedKnowledgePointsData = storageSubmission.data.confirmedKnowledgePoints;
          }
        }
      }

      // 如果在提交数据中没有找到已确认的知识点状态，尝试从全局审核状态中获取
      if (Object.keys(confirmedKnowledgePointsData).length === 0) {
        const reviewStateKey = 'gradnote-knowledge-review-state';
        const reviewStateData = JSON.parse(localStorage.getItem(reviewStateKey));
        if (reviewStateData && reviewStateData.confirmedKnowledgePoints) {
          confirmedKnowledgePointsData = reviewStateData.confirmedKnowledgePoints;
        }
      }
    } catch (error) {
      console.error('从 localStorage 获取知识点数据失败', error);
    }

    // 如果从 localStorage 中无法获取数据，则使用内存中的数据
    if (!knowledgeMarksData) {
      const { data } = submission;
      knowledgeMarksData = data.knowledgeMarks || {};
    }

    // 自定义函数检查知识点是否已确认，优先使用从 localStorage 中获取的状态
    const isPointConfirmed = (submissionId, pointId, isExisting) => {
      const key = `${submissionId}_${pointId}_${isExisting ? 'existing' : 'new'}`;
      return !!confirmedKnowledgePointsData[key] || isKnowledgePointConfirmed(submissionId, pointId, isExisting);
    };

    // 过滤出已确认的知识点
    const confirmedExistingPoints = knowledgeMarksData.existing_knowledge_points
      ?.filter(point => isPointConfirmed(submission.id, point.id, true))
      || [];

    const confirmedNewPoints = knowledgeMarksData.new_knowledge_points
      ?.filter(point => isPointConfirmed(submission.id, point.item, false))
      || [];

    if (confirmedExistingPoints.length === 0 && confirmedNewPoints.length === 0) {
      return (
        <EmptyContainer>
          <Empty description="无已确认的知识点" />
        </EmptyContainer>
      );
    }

    return (
      <>
        {confirmedExistingPoints.length > 0 && (
          <div>
            <div style={{ marginBottom: '8px' }}>已有知识点:</div>
            <KnowledgeList>
              {confirmedExistingPoints.map((point, index) => (
                <KnowledgePointItem
                  key={`existing-${index}`}
                  knowledgePoint={point}
                  isConfirmed={true}
                  isRejected={false}
                  readOnly={true}
                />
              ))}
            </KnowledgeList>
          </div>
        )}

        {confirmedNewPoints.length > 0 && (
          <div>
            <div style={{ marginBottom: '8px', marginTop: '16px' }}>新知识点:</div>
            <KnowledgeList>
              {confirmedNewPoints.map((point, index) => (
                <KnowledgePointItem
                  key={`new-${index}`}
                  knowledgePoint={point}
                  isConfirmed={true}
                  isRejected={false}
                  readOnly={true}
                />
              ))}
            </KnowledgeList>
          </div>
        )}
      </>
    );
  };

  return (
    <PageContainer>
      

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
          {/* 主标签页：待审核/已审核 */}
          <Tabs activeKey={activeMainTab} onChange={handleMainTabChange}>
            <TabPane tab="待审核" key="pending">
              {pendingReviewSubmissions.length > 0 ? (
                <Tabs
                  activeKey={currentSubmissionIndex.toString()}
                  onChange={handleTabChange}
                  type="card"
                >
                  {pendingReviewSubmissions.map((_, index) => (
                    <TabPane tab={`错题 ${index + 1}`} key={index}>
                      {renderPendingSubmissionContent()}
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
            </TabPane>

            <TabPane tab="已审核" key="reviewed">
              {reviewedSubmissions.length > 0 ? (
                <Tabs
                  activeKey={currentSubmissionIndex.toString()}
                  onChange={handleTabChange}
                  type="card"
                >
                  {reviewedSubmissions.map((_, index) => (
                    <TabPane tab={`错题 ${index + 1}`} key={index}>
                      {renderReviewedSubmissionContent()}
                    </TabPane>
                  ))}
                </Tabs>
              ) : (
                <StyledCard>
                  <EmptyContainer>
                    <Empty description="暂无已审核的知识点" />
                  </EmptyContainer>
                </StyledCard>
              )}
            </TabPane>
          </Tabs>
        </>
      )}
    </PageContainer>
  );
};

export default KnowledgeReviewPage;