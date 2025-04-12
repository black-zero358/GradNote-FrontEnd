import axiosInstance from './axios.config';
import config from '../config';

/**
 * 解答错题
 * @param {number} questionId - 错题ID
 * @param {Object} data - 解题数据
 * @param {Array<number>} data.knowledge_points - 知识点ID列表
 * @returns {Promise} - 返回包含解题结果的Promise
 */
export const solveQuestion = async (questionId, data) => {
  return axiosInstance.post(`/solving/${questionId}`, data, {
    // 为调用LLM的API设置更长的超时时间
    timeout: config.api.llmTimeout
  });
};
