import React from 'react';
import { Card, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

const PageContainer = styled.div`
  padding: 24px;
`;

/**
 * 错题提交页面
 * @returns {JSX.Element}
 */
const SubmissionDashboard = () => {
  return (
    <PageContainer>
      <Title level={2}>错题提交</Title>
      <Card>
        <p>错题提交页面正在开发中...</p>
      </Card>
    </PageContainer>
  );
};

export default SubmissionDashboard; 