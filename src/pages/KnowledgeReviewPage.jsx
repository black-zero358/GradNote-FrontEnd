import React from 'react';
import { Card, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

const PageContainer = styled.div`
  padding: 24px;
`;

/**
 * 知识点审核页面
 * @returns {JSX.Element}
 */
const KnowledgeReviewPage = () => {
  return (
    <PageContainer>
      <Title level={2}>知识点审核</Title>
      <Card>
        <p>知识点审核页面正在开发中...</p>
      </Card>
    </PageContainer>
  );
};

export default KnowledgeReviewPage; 