import axiosInstance from './axios.config';
import { getQuestions } from './question.service';
import { getPopularKnowledgePoints, getSubjects } from './knowledge.service';
import config from '../config';

/**
 * 获取错题统计数据
 * @param {string} timeRange - 时间范围（day/week/month/year）
 * @param {Object} [options] - 其他选项
 * @param {string} [options.subject] - 按科目筛选
 * @returns {Promise} - 返回包含错题统计数据的Promise
 */
export const getQuestionsStats = async (timeRange = 'week', options = {}) => {
  // 这里示例用getQuestions获取错题列表后手动处理统计
  // 实际开发可根据后端API情况调整
  try {
    const questions = await getQuestions();
    
    // 处理为需要的统计数据格式
    // 示例数据结构，实际项目中需要根据真实数据调整
    const statsData = [
      { name: '周一', submitted: 4, solved: 2 },
      { name: '周二', submitted: 6, solved: 4 },
      { name: '周三', submitted: 3, solved: 1 },
      { name: '周四', submitted: 5, solved: 3 },
      { name: '周五', submitted: 7, solved: 5 },
      { name: '周六', submitted: 2, solved: 1 },
      { name: '周日', submitted: 3, solved: 2 },
    ];
    
    return statsData;
  } catch (error) {
    console.error('获取错题统计数据失败:', error);
    throw error;
  }
};

/**
 * 获取知识点统计数据
 * @param {string} timeRange - 时间范围（day/week/month/year）
 * @param {Object} [options] - 其他选项
 * @param {string} [options.subject] - 按科目筛选
 * @param {number} [options.limit] - 返回数据条数限制
 * @returns {Promise} - 返回包含知识点统计数据的Promise
 */
export const getKnowledgeStats = async (timeRange = 'week', options = {}) => {
  try {
    // 获取热门知识点
    const popularKnowledgePoints = await getPopularKnowledgePoints(options.limit || 5);
    
    // 转换为饼图数据格式
    const pieData = popularKnowledgePoints.map(point => ({
      name: point.item,
      value: point.mark_count
    }));
    
    return pieData;
  } catch (error) {
    console.error('获取知识点统计数据失败:', error);
    throw error;
  }
};

/**
 * 获取仪表盘概览数据
 * @returns {Promise} - 返回包含仪表盘概览数据的Promise
 */
export const getDashboardSummary = async () => {
  try {
    // 获取问题列表用于统计
    const questions = await getQuestions();
    
    // 这里示例用本地计算统计，实际开发可根据后端API调整
    const summary = {
      totalQuestions: questions.length || 0,
      solvedQuestions: questions.filter(q => q.solution).length || 0,
      totalKnowledge: 0, // 需要根据实际API获取
      totalSolutions: 0  // 需要根据实际API获取
    };
    
    return summary;
  } catch (error) {
    console.error('获取仪表盘概览数据失败:', error);
    throw error;
  }
};

/**
 * 获取最近添加的错题
 * @param {number} [limit=5] - 返回错题的数量
 * @returns {Promise} - 返回包含最近错题的Promise
 */
export const getRecentQuestions = async (limit = 5) => {
  try {
    // 获取错题列表
    const questions = await getQuestions({ limit });
    
    // 格式化为前端需要的格式
    const recentQuestions = questions.map(q => ({
      id: q.id,
      title: q.content.substring(0, 30) + (q.content.length > 30 ? '...' : ''),
      subject: q.subject || '未分类',
      createdAt: new Date(q.created_at).toLocaleDateString()
    }));
    
    return recentQuestions;
  } catch (error) {
    console.error('获取最近错题失败:', error);
    throw error;
  }
};

/**
 * 获取用户解题进度数据
 * @param {string} timeRange - 时间范围（day/week/month/year）
 * @returns {Promise} - 返回包含解题进度数据的Promise
 */
export const getSolvingProgress = async (timeRange = 'week') => {
  // 示例数据，实际开发需要根据后端API调整
  const progressData = [
    { date: '2023-01-01', completed: 5, total: 10 },
    { date: '2023-01-02', completed: 7, total: 12 },
    { date: '2023-01-03', completed: 3, total: 8 },
    { date: '2023-01-04', completed: 8, total: 15 },
    { date: '2023-01-05', completed: 12, total: 20 },
  ];
  
  return progressData;
};

/**
 * 获取科目列表（用于仪表盘筛选）
 * @returns {Promise} - 返回包含科目列表的Promise
 */
export const getSubjectOptions = async () => {
  try {
    const subjects = await getSubjects();
    
    // 格式化为Select组件需要的格式
    const options = subjects.map(subject => ({
      value: subject,
      label: subject
    }));
    
    return options;
  } catch (error) {
    console.error('获取科目列表失败:', error);
    // 返回默认科目列表，避免UI显示错误
    return [
      { value: 'math', label: '数学' },
      { value: 'physics', label: '物理' },
      { value: 'chemistry', label: '化学' },
      { value: 'biology', label: '生物' },
      { value: 'english', label: '英语' },
      { value: 'chinese', label: '语文' },
    ];
  }
}; 