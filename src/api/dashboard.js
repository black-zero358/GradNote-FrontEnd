import api from './auth';
import { setAuthToken } from './auth';

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

// 获取新增错题数量数据
export const getNewQuestionsCount = async (timeRange = 'weekly') => {
  try {
    // 确保token已设置
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
    
    // 使用正确的API端点，并添加适当的查询参数
    const response = await api.get('/questions/', {
      params: {
        skip: 0,
        limit: 100
      }
    });

    // 根据timeRange过滤数据
    const now = new Date();
    const filteredData = response.data.filter(question => {
      const questionDate = new Date(question.created_at);
      const diffDays = Math.floor((now - questionDate) / (1000 * 60 * 60 * 24));
      
      switch(timeRange) {
        case 'weekly':
          return diffDays <= 7;
        case 'monthly':
          return diffDays <= 30;
        case 'yearly':
          return diffDays <= 365;
        default:
          return true;
      }
    });

    // 处理返回的数据，按照图表所需的格式进行转换
    const processedData = filteredData.map(question => ({
      day: new Date(question.created_at).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }).replace('/', '.'),
      高数: question.subject === '高数' ? 1 : 0,
      线代: question.subject === '线代' ? 1 : 0,
      概率论: question.subject === '概率论' ? 1 : 0
    }));

    // 按天分组并汇总数据
    const groupedData = processedData.reduce((acc, curr) => {
      const existingDay = acc.find(item => item.day === curr.day);
      if (existingDay) {
        existingDay.高数 += curr.高数;
        existingDay.线代 += curr.线代;
        existingDay.概率论 += curr.概率论;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

    // 按日期排序
    return groupedData.sort((a, b) => {
      const [aMonth, aDay] = a.day.split('.').map(Number);
      const [bMonth, bDay] = b.day.split('.').map(Number);
      if (aMonth !== bMonth) return aMonth - bMonth;
      return aDay - bDay;
    });
  } catch (error) {
    console.error('获取新增错题数量数据失败', error);
    throw error.response?.data || { message: '获取数据失败，请稍后重试' };
  }
};

// 获取新增知识点数量数据
export const getNewKnowledgeCount = async (timeRange = 'weekly') => {
  try {
    // 确保token已设置
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
    
    // 使用知识点搜索API，按创建时间排序
    const response = await api.get('/knowledge/search', {
      params: {
        sort_by: 'created_at',
        skip: 0,
        limit: 100
      }
    });

    // 根据timeRange过滤数据
    const now = new Date();
    const filteredData = response.data.filter(point => {
      const pointDate = new Date(point.created_at);
      const diffDays = Math.floor((now - pointDate) / (1000 * 60 * 60 * 24));
      
      switch(timeRange) {
        case 'weekly':
          return diffDays <= 7;
        case 'monthly':
          return diffDays <= 30;
        case 'yearly':
          return diffDays <= 365;
        default:
          return true;
      }
    });

    // 处理返回的数据，按照图表所需的格式进行转换
    const processedData = filteredData.map(point => ({
      day: new Date(point.created_at).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }).replace('/', '.'),
      高数: point.subject === '高数' ? 1 : 0,
      线代: point.subject === '线代' ? 1 : 0,
      概率论: point.subject === '概率论' ? 1 : 0
    }));

    // 按天分组并汇总数据
    const groupedData = processedData.reduce((acc, curr) => {
      const existingDay = acc.find(item => item.day === curr.day);
      if (existingDay) {
        existingDay.高数 += curr.高数;
        existingDay.线代 += curr.线代;
        existingDay.概率论 += curr.概率论;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

    // 按日期排序
    return groupedData.sort((a, b) => {
      const [aMonth, aDay] = a.day.split('.').map(Number);
      const [bMonth, bDay] = b.day.split('.').map(Number);
      if (aMonth !== bMonth) return aMonth - bMonth;
      return aDay - bDay;
    });
  } catch (error) {
    console.error('获取新增知识点数量数据失败', error);
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