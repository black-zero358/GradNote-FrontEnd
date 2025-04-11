import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/localStorage';

// 懒加载路由组件
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const SubmissionDashboard = React.lazy(() => import('./pages/SubmissionDashboard'));
const KnowledgeReviewPage = React.lazy(() => import('./pages/KnowledgeReviewPage'));

// 布局组件
import MainLayout from './layouts/MainLayout';

// 加载中显示的组件
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    正在加载...
  </div>
);

// 私有路由，需要登录才能访问
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// 路由配置
const AppRouter = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* 公共路由 */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* 私有路由 */}
          <Route path="/" element={
            <PrivateRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </PrivateRoute>
          } />
          
          <Route path="/submission" element={
            <PrivateRoute>
              <MainLayout>
                <SubmissionDashboard />
              </MainLayout>
            </PrivateRoute>
          } />
          
          <Route path="/knowledge" element={
            <PrivateRoute>
              <MainLayout>
                <KnowledgeReviewPage />
              </MainLayout>
            </PrivateRoute>
          } />
          
          {/* 404重定向 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default AppRouter; 