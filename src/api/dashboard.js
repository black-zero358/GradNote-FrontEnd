import api from './auth';

// 获取错题统计数据
export const getQuestionStats = async (timeRange = 'weekly') => {
  try {
    const response = await api.get(`/questions/stats?range=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('获取错题统计数据失败', error);
    throw error.response?.data || { message: '获取数据失败，请稍后重试' };
  }
};

// 获取知识点统计数据
export const getKnowledgeStats = async (timeRange = 'weekly') => {
  try {
    const response = await api.get(`/knowledge/stats?range=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('获取知识点统计数据失败', error);
    throw error.response?.data || { message: '获取数据失败，请稍后重试' };
  }
};

// 获取知识点占比数据
export const getKnowledgeRatio = async (subject = '高数') => {
  try {
    const response = await api.get(`/knowledge/ratio?subject=${subject}`);
    return response.data;
  } catch (error) {
    console.error('获取知识点占比数据失败', error);
    throw error.response?.data || { message: '获取数据失败，请稍后重试' };
  }
};

// 获取用户信息和统计摘要
export const getUserStats = async () => {
  try {
    const response = await api.get('/users/stats');
    return response.data;
  } catch (error) {
    console.error('获取用户统计数据失败', error);
    throw error.response?.data || { message: '获取数据失败，请稍后重试' };
  }
}; 