import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';

/**
 * 多图片上传队列管理Hook
 * @param {Function} uploadHandler - 单张图片上传处理函数
 * @returns {Object} - 队列管理方法和状态
 */
const useMultipleUpload = (uploadHandler) => {
  // 上传队列状态
  const [uploadQueue, setUploadQueue] = useState([]);
  // 当前是否正在处理上传
  const [isProcessing, setIsProcessing] = useState(false);
  // 已完成的上传数量
  const [completedCount, setCompletedCount] = useState(0);
  // 总上传数量
  const [totalCount, setTotalCount] = useState(0);

  /**
   * 添加文件到上传队列
   * @param {FileList|File[]} files - 要上传的文件列表
   */
  const addToQueue = useCallback((files) => {
    if (!files || files.length === 0) return;

    // 将FileList转换为数组
    const fileArray = Array.from(files);
    
    setUploadQueue(prevQueue => [...prevQueue, ...fileArray]);
    setTotalCount(prevTotal => prevTotal + fileArray.length);
    
    // 显示提示消息
    message.info(`已添加 ${fileArray.length} 张图片到上传队列`);
  }, []);

  /**
   * 清空上传队列
   */
  const clearQueue = useCallback(() => {
    setUploadQueue([]);
    setCompletedCount(0);
    setTotalCount(0);
    setIsProcessing(false);
  }, []);

  /**
   * 处理队列中的下一个文件
   */
  const processNextFile = useCallback(async () => {
    if (uploadQueue.length === 0) {
      setIsProcessing(false);
      if (totalCount > 0) {
        message.success(`所有 ${totalCount} 张图片已上传完成`);
      }
      return;
    }

    setIsProcessing(true);
    const nextFile = uploadQueue[0];
    
    try {
      // 调用传入的上传处理函数
      await uploadHandler(nextFile);
      
      // 更新计数和队列
      setCompletedCount(prev => prev + 1);
      setUploadQueue(prevQueue => prevQueue.slice(1));
    } catch (error) {
      console.error('上传图片失败:', error);
      message.error(`图片 "${nextFile.name}" 上传失败: ${error.message || '未知错误'}`);
      
      // 从队列中移除失败的文件
      setUploadQueue(prevQueue => prevQueue.slice(1));
    }
  }, [uploadQueue, uploadHandler, totalCount]);

  // 当队列状态变化时，处理下一个文件
  useEffect(() => {
    if (uploadQueue.length > 0 && !isProcessing) {
      processNextFile();
    }
  }, [uploadQueue, isProcessing, processNextFile]);

  return {
    addToQueue,
    clearQueue,
    uploadQueue,
    isProcessing,
    completedCount,
    totalCount,
    progress: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  };
};

export default useMultipleUpload;
