import React from 'react';
import { Layout, Typography } from 'antd';
import styled from 'styled-components';

const { Content } = Layout;
const { Title } = Typography;

// 使用styled-components创建样式化组件
const StyledLayout = styled(Layout)`
  height: 100vh;
  background: #f0f2f5;
`;

const StyledContent = styled(Content)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px 24px;
`;

const LogoWrapper = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

const Logo = styled.img`
  height: 64px;
  margin-bottom: 16px;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
`;

/**
 * 认证页面的布局组件
 * @param {Object} props
 * @param {React.ReactNode} props.children - 子组件
 * @param {string} props.title - 页面标题
 * @returns {JSX.Element}
 */
const AuthLayout = ({ children, title }) => {
  return (
    <StyledLayout>
      <StyledContent>
        <LogoWrapper>
          <Logo src="/logo.png" alt="GradNote Logo" />
          <Title level={2}>GradNote错题管理系统</Title>
        </LogoWrapper>
        <FormWrapper>
          {title && <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>{title}</Title>}
          {children}
        </FormWrapper>
      </StyledContent>
    </StyledLayout>
  );
};

export default AuthLayout; 