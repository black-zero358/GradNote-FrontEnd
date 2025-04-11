import axiosInstance from './axios.config';

/**
 * 基于结构化信息（科目、章节、小节）查询知识点
 * @param {string} subject - 科目
 * @param {string} [chapter] - 章节（可选）
 * @param {string} [section] - 小节（可选）
 * @returns {Promise} - 返回包含知识点列表的Promise
 */
export const getKnowledgePointsByStructure = async (subject, chapter, section) => {
  const params = new URLSearchParams();
  params.append('subject', subject);
  
  if (chapter) {
    params.append('chapter', chapter);
  }
  
  if (section) {
    params.append('section', section);
  }
  
  return axiosInstance.get(`/knowledge/structure?${params.toString()}`);
};

/**
 * 按条件搜索知识点
 * @param {Object} options - 搜索选项
 * @param {string} [options.subject] - 科目
 * @param {string} [options.chapter] - 章节
 * @param {string} [options.section] - 小节
 * @param {string} [options.item] - 知识点名称（支持模糊搜索）
 * @param {string} [options.sort_by] - 排序字段
 * @param {number} [options.skip] - 跳过的记录数
 * @param {number} [options.limit] - 返回的最大记录数
 * @returns {Promise} - 返回包含知识点列表的Promise
 */
export const searchKnowledgePoints = async (options = {}) => {
  const { subject, chapter, section, item, sort_by, skip = 0, limit = 100 } = options;
  
  const params = new URLSearchParams();
  
  if (subject) params.append('subject', subject);
  if (chapter) params.append('chapter', chapter);
  if (section) params.append('section', section);
  if (item) params.append('item', item);
  if (sort_by) params.append('sort_by', sort_by);
  
  params.append('skip', skip.toString());
  params.append('limit', limit.toString());
  
  return axiosInstance.get(`/knowledge/search?${params.toString()}`);
};

/**
 * 获取最热门的知识点（根据标记次数）
 * @param {number} [limit=10] - 返回的记录数
 * @returns {Promise} - 返回包含热门知识点列表的Promise
 */
export const getPopularKnowledgePoints = async (limit = 10) => {
  return axiosInstance.get(`/knowledge/popular?limit=${limit}`);
};

/**
 * 获取所有科目列表
 * @returns {Promise} - 返回包含科目列表的Promise
 */
export const getSubjects = async () => {
  return axiosInstance.get('/knowledge/subjects');
};

/**
 * 获取指定科目的所有章节
 * @param {string} subject - 科目名称
 * @returns {Promise} - 返回包含章节列表的Promise
 */
export const getChapters = async (subject) => {
  return axiosInstance.get(`/knowledge/chapters?subject=${encodeURIComponent(subject)}`);
};

/**
 * 获取指定科目和章节的所有小节
 * @param {string} subject - 科目名称
 * @param {string} chapter - 章节名称
 * @returns {Promise} - 返回包含小节列表的Promise
 */
export const getSections = async (subject, chapter) => {
  const params = new URLSearchParams();
  params.append('subject', subject);
  params.append('chapter', chapter);
  
  return axiosInstance.get(`/knowledge/sections?${params.toString()}`);
};

/**
 * 获取当前用户的所有标记
 * @returns {Promise} - 返回包含用户标记列表的Promise
 */
export const getUserMarks = async () => {
  return axiosInstance.get('/knowledge/user-marks');
};

/**
 * 根据ID获取知识点详情
 * @param {number} id - 知识点ID
 * @returns {Promise} - 返回包含知识点详情的Promise
 */
export const getKnowledgePoint = async (id) => {
  return axiosInstance.get(`/knowledge/${id}`);
};

/**
 * 增加知识点标记次数
 * @param {number} id - 知识点ID
 * @returns {Promise} - 返回包含知识点详情的Promise
 */
export const markKnowledgePoint = async (id) => {
  return axiosInstance.post(`/knowledge/mark/${id}`);
};

/**
 * 创建用户知识点标记记录
 * @param {Object} data - 标记数据
 * @param {number} data.knowledge_point_id - 知识点ID
 * @param {number} data.question_id - 题目ID
 * @returns {Promise} - 返回包含标记详情的Promise
 */
export const createUserMark = async (data) => {
  return axiosInstance.post('/knowledge/user-mark', data);
};

/**
 * 创建新的知识点
 * @param {Object} data - 知识点数据
 * @param {string} data.subject - 科目
 * @param {string} data.chapter - 章节
 * @param {string} data.section - 小节
 * @param {string} data.item - 知识点名称
 * @param {string} [data.details] - 知识点详情
 * @returns {Promise} - 返回包含知识点详情的Promise
 */
export const createKnowledgePoint = async (data) => {
  return axiosInstance.post('/knowledge/', data);
};

/**
 * 分析题目文本，返回可能的知识点类别
 * @param {string} questionText - 题目文本
 * @returns {Promise} - 返回包含知识点类别的Promise
 */
export const analyzeKnowledgeFromQuestion = async (questionText) => {
  return axiosInstance.post('/knowledge/analyze-from-question', {
    question_text: questionText
  });
};

/**
 * 从解题过程中提取使用的知识点
 * @param {Object} data - 提取数据
 * @param {string} data.question_text - 题目文本
 * @param {string} data.solution_text - 解题过程文本
 * @param {Array<number>} [data.existing_knowledge_point_ids] - 已知的知识点ID列表
 * @returns {Promise} - 返回包含提取知识点的Promise
 */
export const extractKnowledgeFromSolution = async (data) => {
  return axiosInstance.post('/knowledge/extract-from-solution', data);
};

/**
 * 处理用户确认的知识点标记
 * @param {Object} data - 标记数据
 * @param {number} data.question_id - 题目ID
 * @param {Array<number>} [data.existing_knowledge_point_ids] - 确认标记的已存在知识点ID列表
 * @param {Array<Object>} [data.new_knowledge_points] - 确认创建的新知识点列表
 * @returns {Promise} - 返回包含标记结果的Promise
 */
export const markConfirmedKnowledgePoints = async (data) => {
  return axiosInstance.post('/knowledge/mark-confirmed', data);
}; 