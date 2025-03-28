# GradNote 前端

GradNote是一个错题管理与学习工具，帮助学生记录、分析和复习错题，提高学习效率。

## 技术栈

- React 18
- React Router v6
- Axios
- React Context API
- Recharts (数据可视化)

## 功能特性

- 用户认证（登录/注册）
- 错题记录与管理
- 知识点关联与统计分析
- 个人学习数据可视化
- 用户设置管理

## 项目结构

```
gradnote-frontend/
├── public/               # 静态资源
│   ├── images/           # 图片资源
│   └── index.html        # HTML入口文件
├── src/                  # 源代码
│   ├── api/              # API接口模块
│   │   ├── auth.js       # 认证相关API
│   │   ├── dashboard.js  # 数据看板相关API
│   │   └── index.js      # API导出入口
│   ├── components/       # UI组件
│   │   ├── Dashboard.js  # 主面板组件
│   │   ├── LoginPage.js  # 登录/注册页面
│   │   └── Settings.js   # 设置页面
│   ├── contexts/         # React上下文
│   │   └── AuthContext.js # 认证上下文
│   ├── App.js            # 应用主组件
│   ├── App.css           # 全局样式
│   └── index.js          # 应用入口
└── package.json          # 项目配置和依赖
```

## 项目设置

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm start
```

### 构建生产版本

```bash
npm run build
```

## API接口

项目使用RESTful API与后端交互，API基础URL为`/api/v1`。主要API包括：

- 认证API (登录/注册)
- 错题管理API
- 知识点统计API
- 用户数据分析API

## 路由结构

- `/login` - 登录/注册页面
- `/` - 主面板/错题管理
- `/settings` - 用户设置

详细API文档请参考`backend-api.md`。 