import { create } from 'zustand';
import { 
  getQuestionsStats, 
  getKnowledgeStats, 
  getDashboardSummary,
  getRecentQuestions
} from '../api/dashboard.service';

/**
 * 创建仪表盘状态存储
 */
const useDashboardStore = create((set, get) => ({
  // 状态
  questionsTimeRange: 'week',
  knowledgeTimeRange: 'week',
  subject: null,
  
  // 数据
  summaryData: null,
  questionsData: null,
  knowledgeData: null,
  recentQuestionsData: null,
  
  // 加载状态
  isLoadingSummary: false,
  isLoadingQuestions: false,
  isLoadingKnowledge: false,
  isLoadingRecentQuestions: false,
  
  // 错误状态
  summaryError: null,
  questionsError: null,
  knowledgeError: null,
  recentQuestionsError: null,
  
  // 设置时间范围
  setQuestionsTimeRange: (range) => set({ questionsTimeRange: range }),
  setKnowledgeTimeRange: (range) => set({ knowledgeTimeRange: range }),
  
  // 设置科目
  setSubject: (subject) => set({ subject }),
  
  // 获取摘要数据
  fetchSummaryData: async () => {
    set({ isLoadingSummary: true, summaryError: null });
    try {
      const data = await getDashboardSummary();
      set({ summaryData: data, isLoadingSummary: false });
      return data;
    } catch (error) {
      set({ 
        summaryError: error.message || '获取摘要数据失败', 
        isLoadingSummary: false 
      });
      throw error;
    }
  },
  
  // 获取错题统计数据
  fetchQuestionsData: async () => {
    const { questionsTimeRange, subject } = get();
    set({ isLoadingQuestions: true, questionsError: null });
    try {
      const data = await getQuestionsStats(questionsTimeRange, { subject });
      set({ questionsData: data, isLoadingQuestions: false });
      return data;
    } catch (error) {
      set({ 
        questionsError: error.message || '获取错题统计数据失败', 
        isLoadingQuestions: false 
      });
      throw error;
    }
  },
  
  // 获取知识点统计数据
  fetchKnowledgeData: async () => {
    const { knowledgeTimeRange, subject } = get();
    set({ isLoadingKnowledge: true, knowledgeError: null });
    try {
      const data = await getKnowledgeStats(knowledgeTimeRange, { subject, limit: 5 });
      set({ knowledgeData: data, isLoadingKnowledge: false });
      return data;
    } catch (error) {
      set({ 
        knowledgeError: error.message || '获取知识点统计数据失败', 
        isLoadingKnowledge: false 
      });
      throw error;
    }
  },
  
  // 获取最近添加的错题
  fetchRecentQuestions: async (limit = 5) => {
    set({ isLoadingRecentQuestions: true, recentQuestionsError: null });
    try {
      const data = await getRecentQuestions(limit);
      set({ recentQuestionsData: data, isLoadingRecentQuestions: false });
      return data;
    } catch (error) {
      set({ 
        recentQuestionsError: error.message || '获取最近错题数据失败', 
        isLoadingRecentQuestions: false 
      });
      throw error;
    }
  },
  
  // 重置所有错误
  clearErrors: () => set({
    summaryError: null,
    questionsError: null,
    knowledgeError: null,
    recentQuestionsError: null
  }),
  
  // 初始化仪表盘数据（一次获取所有数据）
  initDashboard: async () => {
    const { 
      fetchSummaryData, 
      fetchQuestionsData, 
      fetchKnowledgeData, 
      fetchRecentQuestions 
    } = get();
    
    try {
      // 并行请求所有数据
      await Promise.all([
        fetchSummaryData(),
        fetchQuestionsData(),
        fetchKnowledgeData(),
        fetchRecentQuestions()
      ]);
    } catch (error) {
      console.error('初始化仪表盘数据失败:', error);
    }
  }
}));

export default useDashboardStore; 