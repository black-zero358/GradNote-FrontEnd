# GradNote 前端

<p align="center">
  <img src="https://s2.loli.net/2025/04/09/B87fAZSpOULqcDo.webp" alt="GradNote Logo" width="200">
</p>

## 项目概述

GradNote是一个智能错题管理与学习工具，帮助学生高效记录、分析和复习错题，提高学习效率。通过AI驱动的知识点提取和解题分析，GradNote能够自动关联错题与知识点，生成个性化的学习报告和复习计划。

## 主要功能

- **错题智能录入**：支持图片上传，自动OCR识别题目和答案内容
- **知识点分析**：自动分析错题涉及的知识点，并关联到知识体系
- **解题过程生成**：AI辅助生成详细的解题步骤和思路分析
- **知识点审核**：用户可确认、编辑或拒绝系统提取的知识点
- **学习数据可视化**：直观展示错题分布、知识点掌握情况等学习数据
- **多图片批量上传**：支持拖拽或多选方式同时上传多张错题图片
- **数学公式渲染**：支持LaTeX数学公式的显示和编辑
- **Markdown支持**：题目和解析支持Markdown格式

## 技术栈

- **前端框架**：React 18
- **路由管理**：React Router v6
- **状态管理**：
  - Zustand (客户端状态)
  - TanStack Query (服务器状态)
- **UI组件库**：Ant Design 5.x
- **样式解决方案**：Styled Components
- **HTTP客户端**：Axios
- **数据可视化**：Recharts
- **数学公式**：KaTeX
- **Markdown渲染**：React Markdown

## 项目结构

```
gradnote-frontend/
├── public/                 # 静态资源
│   └── index.html          # HTML入口文件
├── src/                    # 源代码
│   ├── api/                # API接口模块
│   │   ├── auth.service.js     # 认证相关API
│   │   ├── dashboard.service.js # 数据看板相关API
│   │   ├── image.service.js    # 图片处理API
│   │   ├── knowledge.service.js # 知识点相关API
│   │   ├── question.service.js # 错题相关API
│   │   ├── solving.service.js  # 解题过程API
│   │   └── axios.config.js     # Axios配置
│   ├── components/         # UI组件
│   │   ├── common/         # 通用组件
│   │   ├── dashboard/      # 仪表盘组件
│   │   ├── knowledge/      # 知识点相关组件
│   │   └── submission/     # 错题提交组件
│   ├── hooks/              # 自定义Hooks
│   │   ├── useSubmission.js    # 错题提交流程Hook
│   │   ├── useKnowledgeReview.js # 知识点审核Hook
│   │   └── useDashboard.js     # 仪表盘数据Hook
│   ├── layouts/            # 布局组件
│   │   ├── MainLayout.jsx      # 主布局
│   │   └── AuthLayout.jsx      # 认证页面布局
│   ├── pages/              # 页面组件
│   │   ├── LoginPage.jsx       # 登录页面
│   │   ├── DashboardPage.jsx   # 仪表盘页面
│   │   ├── SubmissionDashboard.jsx # 错题提交页面
│   │   └── KnowledgeReviewPage.jsx # 知识点审核页面
│   ├── stores/             # 状态管理
│   │   ├── authStore.js        # 认证状态
│   │   └── submissionStore.js  # 错题提交状态
│   ├── styles/             # 样式文件
│   │   ├── global.css          # 全局样式
│   │   └── theme.js            # 主题配置
│   ├── utils/              # 工具函数
│   │   ├── localStorage.js     # 本地存储工具
│   │   └── imageUtils.js       # 图片处理工具
│   ├── App.jsx             # 应用主组件
│   ├── router.jsx          # 路由配置
│   ├── queryClient.js      # TanStack Query配置
│   ├── config.js           # 全局配置
│   └── index.js            # 应用入口
├── .env.example            # 环境变量示例
├── package.json            # 项目配置和依赖
└── backend-api.md          # 后端API文档
```

## 环境要求

- Node.js 16.x 或更高版本
- npm 8.x 或更高版本

## 项目设置

### 1. 克隆仓库

```bash
git clone https://github.com/your-username/gradnote-frontend.git
cd gradnote-frontend
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境变量示例文件并根据需要修改：

```bash
cp .env.example .env
```

主要配置项：
- `REACT_APP_BACK_END_API_URL`: 后端API地址，默认为 `http://127.0.0.1:8000/api/v1`

### 4. 运行开发服务器

```bash
npm start
```

应用将在 http://localhost:3000 启动

### 5. 构建生产版本

```bash
npm run build
```

## 错题提交流程

1. **图片上传**：用户上传错题图片
2. **OCR识别**：系统自动识别题目文本
3. **答案识别**：系统识别答案文本（可选）
4. **知识点分析**：系统分析题目涉及的知识点类别
5. **解题过程**：系统生成详细解题步骤
6. **知识点提取**：从解题过程中提取关键知识点
7. **知识点审核**：用户确认或编辑提取的知识点

## 路由结构

- `/login` - 登录/注册页面
- `/` - 仪表盘页面（数据概览）
- `/submission` - 错题提交页面
- `/knowledge` - 知识点审核页面
- `/test-math` - 数学公式测试页面

## API接口

项目使用RESTful API与后端交互，API基础URL为`/api/v1`。主要API包括：

- **认证API**：登录、注册、刷新Token
- **错题管理API**：创建、查询、更新错题
- **图片处理API**：上传图片、OCR识别
- **知识点API**：分析知识点、标记确认知识点
- **解题API**：生成解题过程
- **仪表盘API**：获取统计数据和图表数据

详细API文档请参考 `backend-api.md`。

## 认证机制

系统使用OAuth2密码流进行认证：

1. 用户通过`/api/v1/auth/login`获取访问令牌
2. 前端将令牌存储在localStorage中
3. 所有API请求通过Axios拦截器自动附加令牌
4. 当收到401错误时，系统会自动登出并重定向到登录页面

## 贡献指南

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

本项目采用 GNU AFFERO GENERAL PUBLIC LICENSE - 详情请参阅 [LICENSE](LICENSE) 文件
