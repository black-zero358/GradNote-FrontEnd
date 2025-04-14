import config from '../config';

// 存储已知无效的blob URLs
const invalidBlobUrls = new Set();

/**
 * 检查Blob URL是否有效
 * 注意：此函数不能完全确定blob URL是否有效，因为JavaScript无法直接检查blob URL的有效性
 * 我们只能通过尝试加载图片或记录已知无效的URLs来间接判断
 *
 * @param {string} blobUrl - 要检查的Blob URL
 * @returns {boolean} - URL是否可能有效
 */
export const isBlobUrlValid = (blobUrl) => {
  // 如果URL不是blob URL或为空，则无效
  if (!blobUrl || !blobUrl.startsWith('blob:')) {
    return false;
  }

  // 检查是否在已知无效列表中
  if (invalidBlobUrls.has(blobUrl)) {
    return false;
  }

  // 否则假定有效（实际可能仍然无效，但需要尝试加载才能确定）
  return true;
};

/**
 * 标记Blob URL为无效
 * @param {string} blobUrl - 要标记为无效的Blob URL
 */
export const markBlobUrlInvalid = (blobUrl) => {
  if (blobUrl && blobUrl.startsWith('blob:')) {
    invalidBlobUrls.add(blobUrl);
    console.log(`已标记Blob URL为无效: ${blobUrl}`);
  }
};

/**
 * 从后端路径构建完整的图片URL
 * @param {string} backendPath - 后端图片路径 (e.g., "uploads\\xxx.png")
 * @returns {string} - 完整的后端图片URL
 */
export const buildBackendImageUrl = (backendPath) => {
  if (!backendPath) return null;

  // 处理Windows路径分隔符
  const normalizedPath = backendPath.replace(/\\/g, '/');

  // 从API baseURL中提取基础URL部分（去掉/api/v1等路径）
  const baseUrlMatch = config.api.baseURL.match(/^(https?:\/\/[^\/]+)/);
  const baseUrl = baseUrlMatch ? baseUrlMatch[1] : 'http://127.0.0.1:8000';

  return `${baseUrl}/${normalizedPath}`;
};

/**
 * 获取有效的图片URL
 *
 * 处理逻辑：
 * 1. 首先尝试使用传入的blobUrl（如果存在且可能有效）
 * 2. 如果blobUrl无效或不存在，则使用后端图片路径构建URL
 * 3. 如果都不存在，返回null
 *
 * @param {string|null} blobUrl - Blob URL (e.g., blob:http://localhost:3000/xxx)
 * @param {string|null} backendPath - 后端图片路径 (e.g., "uploads\\xxx.png")
 * @returns {string|null} - 有效的图片URL或null
 */
export const getValidImageUrl = (blobUrl, backendPath) => {
  // 首先检查Blob URL是否可能有效
  if (isBlobUrlValid(blobUrl)) {
    return blobUrl;
  }

  // 如果Blob URL无效或不存在，使用后端图片路径
  if (backendPath) {
    return buildBackendImageUrl(backendPath);
  }

  // 如果都不存在，返回null
  return null;
};

/**
 * 检查URL是否为Blob URL
 * @param {string} url - 要检查的URL
 * @returns {boolean} - 是否为Blob URL
 */
export const isBlobUrl = (url) => {
  return url && url.startsWith('blob:');
};
