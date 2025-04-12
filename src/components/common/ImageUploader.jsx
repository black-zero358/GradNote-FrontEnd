import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Dragger } = Upload;

const UploaderContainer = styled.div`
  margin-bottom: 24px;
`;

const StyledDragger = styled(Dragger)`
  .ant-upload-drag-icon {
    margin-bottom: 16px;
  }
  
  .ant-upload-text {
    margin-bottom: 8px;
    font-size: 16px;
  }
  
  .ant-upload-hint {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
  }
`;

/**
 * 图片上传组件
 * @param {Object} props - 组件属性
 * @param {Function} props.onUpload - 上传成功回调函数
 * @param {boolean} props.disabled - 是否禁用
 * @param {string[]} props.acceptTypes - 接受的文件类型
 * @param {number} props.maxSize - 最大文件大小(MB)
 * @returns {JSX.Element}
 */
const ImageUploader = ({ 
  onUpload, 
  disabled = false, 
  acceptTypes = ['.jpg', '.jpeg', '.png', '.gif'], 
  maxSize = 5 
}) => {
  const [fileList, setFileList] = useState([]);
  
  // 文件上传前检查
  const beforeUpload = (file) => {
    // 检查文件类型
    const isAcceptedType = acceptTypes.some(type => 
      file.type.includes(type.replace('.', '')) || 
      file.name.toLowerCase().endsWith(type)
    );
    
    if (!isAcceptedType) {
      message.error(`只能上传 ${acceptTypes.join(', ')} 格式的图片!`);
      return Upload.LIST_IGNORE;
    }
    
    // 检查文件大小
    const isLessThanMaxSize = file.size / 1024 / 1024 < maxSize;
    if (!isLessThanMaxSize) {
      message.error(`图片必须小于 ${maxSize}MB!`);
      return Upload.LIST_IGNORE;
    }
    
    return true;
  };
  
  // 自定义上传行为
  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      // 调用父组件传入的上传处理函数
      if (onUpload) {
        await onUpload(file);
      }
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };
  
  // 文件状态改变处理
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  
  // 上传按钮
  const uploadButton = (
    <Button icon={<UploadOutlined />} disabled={disabled}>
      选择图片
    </Button>
  );

  return (
    <UploaderContainer>
      <StyledDragger
        name="file"
        multiple={false}
        fileList={fileList}
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        onChange={handleChange}
        disabled={disabled}
        showUploadList={false}
        data-testid="image-uploader"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽图片到此区域上传</p>
        <p className="ant-upload-hint">
          支持 {acceptTypes.join(', ')} 格式的图片，大小不超过 {maxSize}MB
        </p>
      </StyledDragger>
    </UploaderContainer>
  );
};

export default ImageUploader;
