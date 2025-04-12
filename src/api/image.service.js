import axiosInstance from './axios.config';

/**
 * 处理错题图像并提取文本
 * @param {File} file - 要处理的图像文件
 * @returns {Promise} - 返回包含处理结果的Promise
 */
export const processImage = async (file) => {
  // 创建FormData对象
  const formData = new FormData();
  formData.append('file', file);
  
  return axiosInstance.post('/image/process', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * 处理答案图像并提取文本
 * @param {File} file - 要处理的图像文件
 * @returns {Promise} - 返回包含处理结果的Promise
 */
export const processAnswerImage = async (file) => {
  // 创建FormData对象
  const formData = new FormData();
  formData.append('file', file);
  
  return axiosInstance.post('/image/process-answer', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
