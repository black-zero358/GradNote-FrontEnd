import React, { useEffect } from 'react';
import { Form, Input, Button, Checkbox, message, Alert } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';

import { loginUser } from '../api/auth.service';
import useAuthStore from '../stores/authStore';

// 样式组件 - 保持原有的视觉风格
const LoginContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
`;

const LoginLeft = styled.div`
  flex: 1;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Logo = styled.div`
  color: #8a70d6;
  margin-bottom: 80px;
`;

const ImagePlaceholder = styled.div`
  width: 70%;
  max-width: 400px;
  height: auto;

  img {
    width: 100%;
    height: auto;
  }
`;

const LoginRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const LoginFormContainer = styled.div`
  width: 100%;
  max-width: 450px;

  h2 {
    font-size: 24px;
    margin-bottom: 30px;
    font-weight: 600;
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 20px;
  }

  .ant-input-affix-wrapper {
    padding: 12px;
    height: auto;
  }

  .ant-input {
    font-size: 16px;
  }

  .ant-btn-primary {
    background-color: #8a70d6;
    border-color: #8a70d6;
    height: auto;
    padding: 12px;
    font-size: 16px;

    &:hover {
      background-color: #7559c0;
      border-color: #7559c0;
    }

    &:disabled {
      background-color: #b3a2e3;
      border-color: #b3a2e3;
    }
  }
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const ForgotPassword = styled(Link)`
  color: #8a70d6;
`;

const SignupLink = styled.div`
  text-align: center;
  margin-top: 20px;

  a {
    color: #8a70d6;
    font-weight: 500;
  }
`;

/**
 * 登录页面组件
 * @returns {JSX.Element}
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  // 从URL参数中获取重定向路径
  const from = location.state?.from?.pathname || '/';

  // 从Zustand store获取状态和方法
  const { login: authLogin, isAuthenticated, setLoading, error, clearError, setError, tokenExpired, setTokenExpired } = useAuthStore();

  // 如果已经登录，重定向到首页或来源页面
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from);
    }

    // 如果是token过期导致的登录页面，显示提示
    if (tokenExpired) {
      message.warning('您的登录凭证已过期，请重新登录');
      // 重置过期状态，避免重复提示
      setTokenExpired(false);
    }
  }, [isAuthenticated, navigate, from, tokenExpired, setTokenExpired]);

  // 使用TanStack Query的useMutation处理登录请求
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onMutate: () => {
      // 清除之前的错误
      clearError();
      setLoading(true);
    },
    onSuccess: (data) => {
      const { access_token } = data;
      const username = form.getFieldValue('username');

      // 保存token，创建简单的用户对象
      authLogin({
        username,
        id: username // 临时使用，后续可通过getCurrentUser API获取完整用户信息
      }, access_token);

      message.success('登录成功');

      // 重定向到之前尝试访问的页面或首页
      navigate(from);
    },
    onError: (error) => {
      console.error('登录失败:', error);

      // 设置错误状态
      setError({
        type: 'login',
        message: error.response?.data?.detail || '登录失败，请检查用户名和密码'
      });

      // 根据错误类型显示不同消息
      if (error.message === 'Network Error') {
        message.error('网络连接失败，请检查网络设置');
      } else if (error.response?.status === 401) {
        message.error(error.response?.data?.detail || '用户名或密码错误');
      } else if (error.response?.status === 422) {
        message.error('请求格式错误，请稍后重试');
      } else if (error.response?.status === 429) {
        message.error('登录尝试次数过多，请稍后再试');
      } else {
        message.error(error.response?.data?.detail || '登录失败，请稍后重试');
      }
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  // 处理表单提交
  const handleSubmit = (values) => {
    const { username, password, remember } = values;

    // 对输入值进行处理
    const trimmedUsername = username.trim();

    // 如果输入为空，显示表单错误
    if (!trimmedUsername) {
      form.setFields([
        {
          name: 'username',
          errors: ['用户名不能为空']
        }
      ]);
      return;
    }

    // 发起登录请求
    loginMutation.mutate({
      username: trimmedUsername,
      password,
      remember
    });
  };

  return (
    <LoginContainer>
      <LoginLeft>
        <Logo>
          <h1>GradNote</h1>
        </Logo>
        <ImagePlaceholder>
          <img src="https://s2.loli.net/2025/04/09/B87fAZSpOULqcDo.webp" alt="Placeholder" />
        </ImagePlaceholder>
      </LoginLeft>

      <LoginRight>
        <LoginFormContainer>
          <h2>登录</h2>

          {/* 显示错误信息 */}
          {error?.type === 'login' && (
            <Alert
              message={error.message}
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
              data-testid="login-error"
              closable
              onClose={clearError}
            />
          )}

          <StyledForm
            name="login"
            form={form}
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
            size="large"
            data-testid="login-form"
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                  whitespace: true
                }
              ]}
              data-testid="username-field"
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入用户名"
                maxLength={50}
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码'
                }
              ]}
              data-testid="password-field"
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
                autoComplete="current-password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <FormFooter>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <ForgotPassword to="/forgot-password">忘记密码?</ForgotPassword>
            </FormFooter>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loginMutation.isPending}
                data-testid="login-button"
              >
                {loginMutation.isPending ? "登录中..." : "登录"}
              </Button>
            </Form.Item>
          </StyledForm>

          <SignupLink>
            没有账户? <Link to="/register">注册</Link>
          </SignupLink>
        </LoginFormContainer>
      </LoginRight>
    </LoginContainer>
  );
};

export default LoginPage;