import React, { useMemo } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin, Alert, Empty, Select } from 'antd';
import { 
  FormOutlined, 
  CheckCircleOutlined, 
  BookOutlined, 
  SolutionOutlined,
  LoadingOutlined 
} from '@ant-design/icons';
import styled from 'styled-components';

import QuestionsChart from '../components/dashboard/QuestionsChart';
import KnowledgeChart from '../components/dashboard/KnowledgeChart';
import useDashboard from '../hooks/useDashboard';

const { Title } = Typography;
const { Option } = Select;

const StyledCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.09);
  height: 100%;
`;

const ErrorCard = styled(Alert)`
  margin-bottom: 24px;
`;

const EmptyState = styled(Empty)`
  padding: 32px 0;
`;

/**
 * 仪表盘页面组件
 * @returns {JSX.Element}
 */
const DashboardPage = () => {
  // 使用自定义hook获取所有需要的状态和方法
  const {
    // 状态
    questionsTimeRange,
    knowledgeTimeRange,
    subject,
    summaryData,
    questionsData,
    knowledgeData,
    recentQuestionsData,
    subjectOptions,
    
    // 加载状态
    isLoadingSummary,
    isLoadingQuestions,
    isLoadingKnowledge,
    isLoadingRecentQuestions,
    loadingSubjects,
    isLoading,
    
    // 错误状态
    hasError,
    questionsError,
    knowledgeError,
    recentQuestionsError,
    
    // 方法
    handleQuestionsTimeRangeChange,
    handleKnowledgeTimeRangeChange,
    handleSubjectChange,
    clearErrors
  } = useDashboard();
  
  // 使用useMemo计算摘要卡片数据，避免不必要的重渲染
  const summaryCards = useMemo(() => [
    { 
      title: '总提交错题', 
      value: summaryData?.totalQuestions || 0, 
      icon: <FormOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      loading: isLoadingSummary,
      key: 'totalQuestions'
    },
    { 
      title: '已解决错题', 
      value: summaryData?.solvedQuestions || 0, 
      icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      loading: isLoadingSummary,
      key: 'solvedQuestions'
    },
    { 
      title: '知识点数量', 
      value: summaryData?.totalKnowledge || 0, 
      icon: <BookOutlined style={{ fontSize: 24, color: '#faad14' }} />,
      loading: isLoadingSummary,
      key: 'totalKnowledge'
    },
    { 
      title: '解题方法数', 
      value: summaryData?.totalSolutions || 0, 
      icon: <SolutionOutlined style={{ fontSize: 24, color: '#f5222d' }} />,
      loading: isLoadingSummary,
      key: 'totalSolutions'
    },
  ], [summaryData, isLoadingSummary]);
  
  // 如果全局加载中
  if (isLoading) {
    return (
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin 
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} 
          tip="加载中..." 
          size="large" 
        />
      </div>
    );
  }
  
  return (
    <div className="page-container" data-testid="dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} className="page-title">仪表盘</Title>
        
        {/* 科目筛选 */}
        <Select
          placeholder="按科目筛选"
          style={{ width: 120 }}
          onChange={handleSubjectChange}
          value={subject}
          allowClear
          loading={loadingSubjects}
          data-testid="subject-filter"
        >
          {subjectOptions.map(option => (
            <Option key={option.value} value={option.value}>{option.label}</Option>
          ))}
        </Select>
      </div>
      
      {/* 全局错误提示 */}
      {hasError && (
        <ErrorCard
          message="数据加载错误"
          description="部分数据加载失败，请稍后刷新页面重试。"
          type="error"
          showIcon
          closable
          onClose={clearErrors}
          data-testid="dashboard-error"
        />
      )}
      
      {/* 统计摘要 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {summaryCards.map((card) => (
          <Col xs={24} sm={12} lg={6} key={card.key} data-testid={`stat-${card.key}`}>
            <StyledCard>
              <Statistic 
                title={card.title}
                value={card.value}
                prefix={card.icon}
                loading={card.loading}
              />
            </StyledCard>
          </Col>
        ))}
      </Row>
      
      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <QuestionsChart
            timeRange={questionsTimeRange}
            onTimeRangeChange={handleQuestionsTimeRangeChange}
            data={questionsData}
            isLoading={isLoadingQuestions}
            error={questionsError}
          />
        </Col>
        <Col xs={24} lg={12}>
          <KnowledgeChart
            timeRange={knowledgeTimeRange}
            onTimeRangeChange={handleKnowledgeTimeRangeChange}
            data={knowledgeData}
            isLoading={isLoadingKnowledge}
            error={knowledgeError}
          />
        </Col>
      </Row>
      
      {/* 最近错题 */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <StyledCard title="最近添加的错题" data-testid="recent-questions">
            {isLoadingRecentQuestions ? (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <Spin />
              </div>
            ) : recentQuestionsError ? (
              <Alert 
                message="加载失败" 
                description="获取最近错题数据失败，请稍后重试" 
                type="error" 
                showIcon 
              />
            ) : recentQuestionsData?.length > 0 ? (
              <ul>
                {recentQuestionsData.map(question => (
                  <li key={question.id}>
                    {question.title} - {question.subject} - {question.createdAt}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState description="暂无最近添加的错题" />
            )}
          </StyledCard>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage; 