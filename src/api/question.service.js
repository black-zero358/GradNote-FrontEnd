import axiosInstance from './axios.config';

/**
 * 创建新错题
 * @param {Object} data - 错题数据
 * @param {string} data.content - 错题内容
 * @param {string} [data.subject] - 科目
 * @param {string} [data.solution] - 解题过程
 * @param {string} [data.answer] - 答案
 * @param {string} [data.remark] - 备注
 * @param {string} [data.image_url] - 图片URL
 * @returns {Promise} - 返回包含创建的错题的Promise
 */
export const createQuestion = async (data) => {
  return axiosInstance.post('/questions/', data);
};

/**
 * 获取当前用户的错题列表
 * @param {Object} [options] - 选项
 * @param {number} [options.skip=0] - 跳过的记录数
 * @param {number} [options.limit=100] - 返回的最大记录数
 * @returns {Promise} - 返回包含错题列表的Promise
 */
export const getQuestions = async (options = {}) => {
  const { skip = 0, limit = 100 } = options;
  const params = new URLSearchParams();
  
  params.append('skip', skip.toString());
  params.append('limit', limit.toString());
  
  return axiosInstance.get(`/questions/?${params.toString()}`);
};

/**
 * 获取特定错题详情
 * @param {number} id - 错题ID
 * @returns {Promise} - 返回包含错题详情的Promise
 */
export const getQuestion = async (id) => {
  return axiosInstance.get(`/questions/${id}`);
};

/**
 * 更新错题
 * @param {number} id - 错题ID
 * @param {Object} data - 更新数据
 * @param {string} [data.subject] - 科目
 * @param {string} [data.content] - 错题内容
 * @param {string} [data.solution] - 解题过程
 * @param {string} [data.answer] - 答案
 * @param {string} [data.remark] - 备注
 * @param {string} [data.image_url] - 图片URL
 * @returns {Promise} - 返回包含更新后的错题的Promise
 */
export const updateQuestion = async (id, data) => {
  return axiosInstance.put(`/questions/${id}`, data);
};

/**
 * 删除错题
 * @param {number} id - 错题ID
 * @returns {Promise} - 返回包含被删除的错题的Promise
 */
export const deleteQuestion = async (id) => {
  return axiosInstance.delete(`/questions/${id}`);
}; 