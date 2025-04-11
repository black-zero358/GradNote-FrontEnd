import axiosInstance from './axios.config';
import { getQuestions } from './question.service';
import { 
  getPopularKnowledgePoints, 
  getSubjects, 
  searchKnowledgePoints 
} from './knowledge.service';
import config from '../config';

/**
 * 获取错题统计数据
 * @param {string} timeRange - 时间范围（day/week/month/year）
 * @param {Object} [options] - 其他选项
 * @param {string} [options.subject] - 按科目筛选
 * @returns {Promise} - 返回包含错题统计数据的Promise
 */
export const getQuestionsStats = async (timeRange = 'week', options = {}) => {
  try {
    // 获取错题列表
    const questions = await getQuestions();
    
    // 根据timeRange过滤数据
    const filteredQuestions = filterQuestionsByTimeRange(questions, timeRange);
    
    // 如果有主题筛选，进一步过滤
    const finalQuestions = options.subject 
      ? filteredQuestions.filter(q => q.subject === options.subject) 
      : filteredQuestions;
    
    // 生成按日期分组的数据
    const groupedData = groupQuestionsByDate(finalQuestions, timeRange);
    
    return groupedData;
  } catch (error) {
    console.error('获取错题统计数据失败:', error);
    throw error;
  }
};

/**
 * 过滤指定时间范围内的错题
 * @param {Array} questions - 错题列表
 * @param {string} timeRange - 时间范围
 * @returns {Array} - 过滤后的错题列表
 */
const filterQuestionsByTimeRange = (questions, timeRange) => {
  const now = new Date();
  let startDate = new Date();
  
  switch(timeRange) {
    case 'day':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setDate(now.getDate() - 7); // 默认一周
  }
  
  return questions.filter(q => new Date(q.created_at) >= startDate);
};

/**
 * 将错题按日期分组并统计
 * @param {Array} questions - 错题列表
 * @param {string} timeRange - 时间范围
 * @returns {Array} - 分组后的统计数据
 */
const groupQuestionsByDate = (questions, timeRange) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // 确定分组方式
  let groupBy;
  let labels;
  
  switch(timeRange) {
    case 'day':
      groupBy = q => new Date(q.created_at).getHours();
      labels = Array.from({length: 24}, (_, i) => `${i}时`);
      break;
    case 'week':
      groupBy = q => new Date(q.created_at).getDay();
      labels = dayNames;
      break;
    case 'month':
      groupBy = q => new Date(q.created_at).getDate();
      labels = Array.from({length: 31}, (_, i) => `${i+1}日`);
      break;
    case 'year':
      groupBy = q => new Date(q.created_at).getMonth();
      labels = monthNames;
      break;
    default:
      groupBy = q => new Date(q.created_at).getDay();
      labels = dayNames;
  }
  
  // 初始化结果数组
  const result = labels.map((name, index) => ({
    name,
    submitted: 0,
    solved: 0,
    index: timeRange === 'week' ? index : index // 保持原始索引用于排序
  }));
  
  // 统计数据
  questions.forEach(q => {
    const key = groupBy(q);
    if (result[key]) {
      result[key].submitted += 1;
      if (q.solution) {
        result[key].solved += 1;
      }
    }
  });
  
  // 按照索引排序
  return result.sort((a, b) => a.index - b.index).map(({name, submitted, solved}) => ({
    name, submitted, solved
  }));
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
    // 获取知识点数据
    let knowledgePoints;
    
    if (options.subject) {
      // 如果指定了科目，使用searchKnowledgePoints按科目查询
      knowledgePoints = await searchKnowledgePoints({
        subject: options.subject,
        sort_by: 'mark_count',
        limit: options.limit || 5
      });
    } else {
      // 否则获取热门知识点
      knowledgePoints = await getPopularKnowledgePoints(options.limit || 5);
    }
    
    // 转换为饼图数据格式
    const pieData = knowledgePoints.map(point => ({
      name: point.item,
      value: point.mark_count,
      id: point.id,
      subject: point.subject,
      chapter: point.chapter
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
    // 获取问题列表和知识点列表
    const [questions, knowledgePoints] = await Promise.all([
      getQuestions(),
      searchKnowledgePoints()
    ]);
    
    // 计算统计数据
    const summary = {
      totalQuestions: questions.length || 0,
      solvedQuestions: questions.filter(q => q.solution).length || 0,
      totalKnowledge: knowledgePoints.length || 0,
      totalSolutions: questions.filter(q => q.solution).length || 0  // 解题方法数量，这里简化为已解决的题目数
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
    
    // 按创建时间排序（降序）
    const sortedQuestions = [...questions].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    ).slice(0, limit);
    
    // 格式化为前端需要的格式
    const recentQuestions = sortedQuestions.map(q => ({
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
    return []; // 返回空数组，让UI自行处理没有选项的情况
  }
}; 