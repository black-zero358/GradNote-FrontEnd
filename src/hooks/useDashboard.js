import { useState, useEffect } from 'react';
import useDashboardStore from '../stores/dashboardStore';
import { getSubjectOptions } from '../api/dashboard.service';

/**
 * 仪表盘页面Hook
 * 封装了仪表盘页面的数据获取和状态管理逻辑
 * @returns {Object} 仪表盘相关状态和方法
 */
const useDashboard = () => {
  // 从zustand获取状态和操作方法
  const {
    // 状态
    questionsTimeRange,
    knowledgeTimeRange,
    subject,
    summaryData,
    questionsData,
    knowledgeData,
    recentQuestionsData,
    
    // 加载状态
    isLoadingSummary,
    isLoadingQuestions,
    isLoadingKnowledge,
    isLoadingRecentQuestions,
    
    // 错误状态
    summaryError,
    questionsError,
    knowledgeError,
    recentQuestionsError,
    
    // 方法
    setQuestionsTimeRange,
    setKnowledgeTimeRange,
    setSubject,
    fetchSummaryData,
    fetchQuestionsData,
    fetchKnowledgeData,
    fetchRecentQuestions,
    initDashboard,
    clearErrors
  } = useDashboardStore();
  
  // 科目选项状态
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  
  // 初始化数据
  useEffect(() => {
    initDashboard();
    loadSubjects();
    
    // 清理函数
    return () => {
      clearErrors();
    };
  }, []);
  
  // 当筛选条件变化时重新加载相关数据
  useEffect(() => {
    if (subject !== undefined) {
      fetchQuestionsData();
      fetchKnowledgeData();
    }
  }, [subject, questionsTimeRange, knowledgeTimeRange]);
  
  // 加载科目选项
  const loadSubjects = async () => {
    setLoadingSubjects(true);
    try {
      const options = await getSubjectOptions();
      setSubjectOptions(options);
    } catch (error) {
      console.error('加载科目选项失败:', error);
    } finally {
      setLoadingSubjects(false);
    }
  };
  
  // 处理时间范围变更的回调函数
  const handleQuestionsTimeRangeChange = (value) => {
    setQuestionsTimeRange(value);
  };
  
  const handleKnowledgeTimeRangeChange = (value) => {
    setKnowledgeTimeRange(value);
  };
  
  // 处理科目筛选变更
  const handleSubjectChange = (value) => {
    setSubject(value);
  };
  
  // 处理全局加载状态
  const isLoading = isLoadingSummary && isLoadingQuestions && isLoadingKnowledge;
  
  // 处理全局错误状态
  const hasError = summaryError || questionsError || knowledgeError || recentQuestionsError;
  
  // 返回供组件使用的状态和方法
  return {
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
    summaryError,
    questionsError,
    knowledgeError,
    recentQuestionsError,
    hasError,
    
    // 方法
    handleQuestionsTimeRangeChange,
    handleKnowledgeTimeRangeChange,
    handleSubjectChange,
    clearErrors,
    refreshData: initDashboard
  };
};

export default useDashboard; 