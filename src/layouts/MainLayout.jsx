import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, theme, message } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  FormOutlined,
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
  GithubOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useAuthStore from '../stores/authStore';
import useAuthCheck from '../hooks/useAuthCheck';
import { logoutUser } from '../api/auth.service';

const { Header, Sider, Content } = Layout;

const StyledLogo = styled.div`
  height: 32px;
  margin: 16px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledHeader = styled(Header)`
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.span`
  margin-left: 8px;
  margin-right: 16px;
`;

const StyledFooter = styled.footer`
  text-align: center;
  padding: 16px;
  color: rgba(0, 0, 0, 0.45);
  background: white;
  border-top: 1px solid #f0f0f0;

  a {
    color: rgba(0, 0, 0, 0.65);
    &:hover {
      color: #8a70d6;
    }
  }
`;

/**
 * 应用的主布局组件
 * @param {Object} props
 * @param {React.ReactNode} props.children - 子组件
 * @returns {JSX.Element}
 */
const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { token: themeToken } = theme.useToken();
  const location = useLocation();
  const navigate = useNavigate();

  // 从Zustand store获取用户信息和logout方法
  const { user, logout } = useAuthStore();

  // 使用自定义Hook检查认证状态
  useAuthCheck();

  // 处理退出登录
  const handleLogout = async () => {
    try {
      // 先调用后端登出API
      await logoutUser();
      // 然后清除前端状态
      logout();
      message.success('已成功退出登录');
      navigate('/login');
    } catch (error) {
      console.error('登出请求失败', error);
      // 即使后端请求失败，仍然清除前端状态并重定向
      logout();
      navigate('/login');
    }
  };

  // 用户下拉菜单
  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: '个人资料',
        onClick: () => navigate('/profile'),
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: handleLogout,
      },
    ],
  };

  // 侧边栏菜单项
  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">仪表盘</Link>,
    },
    {
      key: '/submission',
      icon: <FormOutlined />,
      label: <Link to="/submission">错题提交</Link>,
    },
    {
      key: '/knowledge',
      icon: <BookOutlined />,
      label: <Link to="/knowledge">知识点审核</Link>,
    },
    {
      key: '/test-math',
      icon: <FormOutlined />,
      label: <Link to="/test-math">数学公式测试</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
        width={220}
      >
        <StyledLogo>
          {!collapsed ? 'GradNote' : 'GN'}
        </StyledLogo>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <StyledHeader>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <UserInfo>
            <Dropdown menu={userMenu} placement="bottomRight">
              <div style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                {!collapsed && <UserName>{user?.username || '用户'}</UserName>}
              </div>
            </Dropdown>
          </UserInfo>
        </StyledHeader>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: themeToken.colorBgContainer,
            borderRadius: 4,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          {children}
        </Content>
        <StyledFooter>
          © 2025 black zero. All Rights Reserved. | Find me on <a href="https://github.com/black-zero358" target="_blank" rel="noopener noreferrer">GitHub <GithubOutlined /></a>
        </StyledFooter>
      </Layout>
    </Layout>
  );
};

export default MainLayout;