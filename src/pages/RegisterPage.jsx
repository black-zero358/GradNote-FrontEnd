import React, { useEffect } from 'react';
import { Form, Input, Button, message, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone, GithubOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';

import { registerUser } from '../api/auth.service';
import useAuthStore from '../stores/authStore';

// 样式组件 - 保持与登录页相同的视觉风格
const RegisterContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
`;

const RegisterLeft = styled.div`
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

const RegisterRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

const RegisterFormContainer = styled.div`
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

const LoginLink = styled.div`
  text-align: center;
  margin-top: 20px;

  a {
    color: #8a70d6;
    font-weight: 500;
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: 16px;
  color: rgba(0, 0, 0, 0.45);
  position: absolute;
  bottom: 0;
  width: 100%;

  a {
    color: rgba(0, 0, 0, 0.65);
    &:hover {
      color: #8a70d6;
    }
  }
`;

/**
 * 注册页面组件
 * @returns {JSX.Element}
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // 从Zustand store获取状态和方法
  const { login: authLogin, isAuthenticated, setLoading, error, clearError, setError } = useAuthStore();

  // 如果已经登录，重定向到首页
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // 使用TanStack Query的useMutation处理注册请求
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onMutate: () => {
      // 清除之前的错误
      clearError();
      setLoading(true);
    },
    onSuccess: (data) => {
      const { username, id } = data;

      message.success('注册成功，请登录');

      // 注册成功后跳转到登录页
      navigate('/login');
    },
    onError: (error) => {
      console.error('注册失败:', error);

      // 设置错误状态
      setError({
        type: 'register',
        message: error.response?.data?.detail || '注册失败，请稍后重试'
      });

      // 根据错误类型显示不同消息
      if (error.message === 'Network Error') {
        message.error('网络连接失败，请检查网络设置');
      } else if (error.response?.status === 422) {
        // 处理验证错误
        const validationErrors = error.response?.data?.detail;
        if (Array.isArray(validationErrors)) {
          const usernameErrors = validationErrors.filter(err => err.loc.includes('username'));
          const emailErrors = validationErrors.filter(err => err.loc.includes('email'));
          const passwordErrors = validationErrors.filter(err => err.loc.includes('password'));

          if (usernameErrors.length > 0) {
            form.setFields([
              {
                name: 'username',
                errors: [usernameErrors[0].msg]
              }
            ]);
          }

          if (emailErrors.length > 0) {
            form.setFields([
              {
                name: 'email',
                errors: [emailErrors[0].msg]
              }
            ]);
          }

          if (passwordErrors.length > 0) {
            form.setFields([
              {
                name: 'password',
                errors: [passwordErrors[0].msg]
              }
            ]);
          }
        } else {
          message.error('请求格式错误，请稍后重试');
        }
      } else if (error.response?.status === 409) {
        message.error('用户名或邮箱已存在');
        form.setFields([
          {
            name: 'username',
            errors: ['用户名可能已被使用']
          }
        ]);
      } else {
        message.error(error.response?.data?.detail || '注册失败，请稍后重试');
      }
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  // 处理表单提交
  const handleSubmit = (values) => {
    const { username, email, password, confirmPassword } = values;

    // 对输入值进行处理
    const trimmedUsername = username.trim();
    const trimmedEmail = email ? email.trim() : '';

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

    // 确认密码是否匹配
    if (password !== confirmPassword) {
      form.setFields([
        {
          name: 'confirmPassword',
          errors: ['两次输入的密码不一致']
        }
      ]);
      return;
    }

    // 发起注册请求
    registerMutation.mutate({
      username: trimmedUsername,
      email: trimmedEmail || null, // 如果为空字符串，则发送null
      password
    });
  };

  return (
    <RegisterContainer>
      <RegisterLeft>
        <Logo>
          <h1>GradNote</h1>
        </Logo>
        <ImagePlaceholder>
          <img src="https://s2.loli.net/2025/04/09/B87fAZSpOULqcDo.webp" alt="Placeholder" />
        </ImagePlaceholder>
      </RegisterLeft>

      <RegisterRight>
        <RegisterFormContainer>
          <h2>注册</h2>

          {/* 显示错误信息 */}
          {error?.type === 'register' && (
            <Alert
              message={error.message}
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
              data-testid="register-error"
              closable
              onClose={clearError}
            />
          )}

          <StyledForm
            name="register"
            form={form}
            onFinish={handleSubmit}
            size="large"
            data-testid="register-form"
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                  whitespace: true
                },
                {
                  min: 3,
                  message: '用户名至少3个字符'
                },
                {
                  max: 30,
                  message: '用户名最多30个字符'
                }
              ]}
              data-testid="username-field"
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入用户名"
                maxLength={30}
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                {
                  type: 'email',
                  message: '请输入有效的邮箱地址'
                }
              ]}
              data-testid="email-field"
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="请输入邮箱（可选）"
                maxLength={100}
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码'
                },
                {
                  min: 6,
                  message: '密码至少6个字符'
                }
              ]}
              data-testid="password-field"
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
                autoComplete="new-password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: '请确认密码'
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
              data-testid="confirm-password-field"
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请确认密码"
                autoComplete="new-password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={registerMutation.isPending}
                data-testid="register-button"
              >
                {registerMutation.isPending ? "注册中..." : "注册"}
              </Button>
            </Form.Item>
          </StyledForm>

          <LoginLink>
            已有账户? <Link to="/login">登录</Link>
          </LoginLink>
        </RegisterFormContainer>
      </RegisterRight>
      <Footer>
        © 2025 black zero. All Rights Reserved. | Find me on <a href="https://github.com/black-zero358" target="_blank" rel="noopener noreferrer">GitHub <GithubOutlined /></a>
      </Footer>
    </RegisterContainer>
  );
};

export default RegisterPage;
