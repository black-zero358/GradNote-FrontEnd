import React, { useState, useEffect } from 'react';
import { Button, Space, Image } from 'antd';
import styled from 'styled-components';
import { InfoCircleOutlined } from '@ant-design/icons';
import StepIndicator, { STEP_STATUS } from '../common/StepIndicator';
import { getValidImageUrl, markBlobUrlInvalid, buildBackendImageUrl } from '../../utils/imageUtils';

// 样式组件
const RowContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 8px;
  border-radius: 4px;
  background-color: #fafafa;
`;

const ImagePreview = styled.div`
  width: 60px;
  height: 60px;
  margin-right: 16px;
  border-radius: 4px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StepsContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

const DetailsButton = styled(Button)`
  margin-left: 16px;
`;

const RowNumber = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1890ff;
  color: white;
  border-radius: 50%;
  margin-right: 16px;
  font-size: 12px;
  font-weight: bold;
`;

/**
 * 错题图片组件 - 处理单个错题行的图片显示
 * @param {Object} props - 组件属性
 * @param {string} props.imageUrl - 图片URL (Blob URL)
 * @param {string} props.backendImagePath - 后端图片路径
 * @param {number} props.rowNumber - 行号
 * @returns {JSX.Element}
 */
const SubmissionImage = ({ imageUrl, backendImagePath, rowNumber }) => {
  // 初始化状态
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  // 当图片URL或后端路径变化时重置状态
  useEffect(() => {
    setCurrentImageUrl(getValidImageUrl(imageUrl, backendImagePath));
    setImageError(false);
  }, [imageUrl, backendImagePath, rowNumber]);

  // 处理图片加载错误
  const handleImageError = () => {
    // 如果当前是blob URL并且加载失败，标记为无效并尝试使用后端图片
    if (currentImageUrl && currentImageUrl.startsWith('blob:')) {
      markBlobUrlInvalid(currentImageUrl);

      // 尝试使用后端图片URL
      if (backendImagePath) {
        const backendUrl = buildBackendImageUrl(backendImagePath);
        setCurrentImageUrl(backendUrl);
        return;
      }
    }

    // 如果后端图片也加载失败或不存在，显示错误状态
    setImageError(true);
  };

  return currentImageUrl && !imageError ? (
    <Image
      src={currentImageUrl}
      alt={`错题图片 ${rowNumber}`}
      preview={{ mask: '查看' }}
      onError={handleImageError}
    />
  ) : (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#f0f0f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      无图片
    </div>
  );
};

/**
 * 提交行组件 - 显示单个错题的处理流程和状态
 * @param {Object} props - 组件属性
 * @param {number} props.rowNumber - 行号
 * @param {string} props.imageUrl - 图片URL (Blob URL)
 * @param {Object} props.data - 提交数据对象
 * @param {Object} props.steps - 步骤状态对象
 * @param {Function} props.onStepClick - 步骤点击回调
 * @param {Function} props.onDetailsClick - 详情按钮点击回调
 * @returns {JSX.Element}
 */
const SubmissionRow = ({
  rowNumber,
  imageUrl,
  data = {},
  steps = {
    ocr: STEP_STATUS.PENDING,
    answer: STEP_STATUS.PENDING,
    knowledge: STEP_STATUS.PENDING,
    solving: STEP_STATUS.PENDING,
    knowledgeMarks: STEP_STATUS.PENDING
  },
  onStepClick,
  onDetailsClick
}) => {
  // 处理步骤点击
  const handleStepClick = (stepName) => {
    if (onStepClick) {
      onStepClick(stepName, rowNumber);
    }
  };

  // 处理详情按钮点击
  const handleDetailsClick = () => {
    if (onDetailsClick) {
      onDetailsClick(rowNumber);
    }
  };

  return (
    <RowContainer data-testid={`submission-row-${rowNumber}`}>
      <RowNumber>{rowNumber}</RowNumber>

      <ImagePreview>
        <SubmissionImage
          imageUrl={imageUrl}
          backendImagePath={data?.ocr?.image_url}
          rowNumber={rowNumber}
        />
      </ImagePreview>

      <StepsContainer>
        <StepIndicator
          status={steps.ocr}
          label="OCR"
          onClick={() => handleStepClick('ocr')}
          tooltipTitle="光学字符识别"
        />

        <StepIndicator
          status={steps.answer}
          label="是否存在答案"
          onClick={() => handleStepClick('answer')}
          tooltipTitle="检测图片中是否包含答案"
        />

        <StepIndicator
          status={steps.knowledge}
          label="检索相关知识点"
          onClick={() => handleStepClick('knowledge')}
          tooltipTitle="根据题目内容检索相关知识点"
        />

        <StepIndicator
          status={steps.solving}
          label="解题"
          onClick={() => handleStepClick('solving')}
          tooltipTitle="使用知识点解答题目"
        />

        <StepIndicator
          status={steps.knowledgeMarks}
          label="返回知识点标记列表"
          onClick={() => handleStepClick('knowledgeMarks')}
          tooltipTitle="提取解题过程中使用的知识点"
          showLine={false}
        />
      </StepsContainer>

      <DetailsButton
        type="text"
        icon={<InfoCircleOutlined />}
        onClick={handleDetailsClick}
        data-testid={`details-button-${rowNumber}`}
      >
        详情
      </DetailsButton>
    </RowContainer>
  );
};

export default SubmissionRow;
