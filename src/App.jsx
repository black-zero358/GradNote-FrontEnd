import React from 'react';
import { App as AntApp } from 'antd';
import AppRouter from './router';

/**
 * 应用根组件
 * @returns {JSX.Element}
 */
const App = () => {
  return (
    <AntApp>
      <AppRouter />
    </AntApp>
  );
};

export default App; 