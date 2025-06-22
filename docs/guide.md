# GradNote-FrontEnd 项目文档

本文档旨在为 GradNote 前端项目提供统一的开发规范和文档指引，确保代码质量、提高开发效率、方便团队协作和后续维护。

## 1. 文档编写规范

### 1.1. 基本原则

*   **清晰性**: 文档内容应清晰易懂，避免模糊不清或有歧义的表述。
*   **准确性**: 确保文档内容与实际代码、功能保持一致。
*   **完整性**: 覆盖项目关键方面，包括但不限于环境配置、架构设计、核心模块、重要组件、公共函数等。
*   **简洁性**: 避免冗长和不必要的描述，突出重点信息。
*   **及时性**: 代码发生变更时，应及时更新相关文档，确保文档的时效性。

### 1.2. 语言与格式

*   **主要语言**: 本项目所有文档统一使用 **中文** 编写。
*   **文件格式**: 主要使用 Markdown (`.md`) 格式。
*   **命名规范**: 文档文件名应清晰表达其内容，使用小写字母和连字符（kebab-case），例如 `component-usage-guide.md`。
*   **排版风格**:
    *   使用合适的标题层级（`#`, `##`, `###` ...）组织内容结构。
    *   代码块使用反引号（```）包裹，并注明语言类型（如 `jsx`, `javascript`, `bash`）。
    *   列表使用 `-` 或 `*`。
    *   强调使用 `**加粗**` 或 `*斜体*`。
    *   引用外部链接使用 `[链接文字](URL)`。

### 1.3. 文档存放位置

*   **核心文档**: 项目级的重要文档（如本文档、架构设计、部署说明）存放在项目根目录下的 `docs` 文件夹（如果未来创建）。
*   **组件文档**: 可复用组件的说明文档（Props、用法示例）可放在项目根目录下的 `docs` 文件夹下的 `components` 文件夹中。
*   **代码注释**:
    *   **模块/文件级注释**: 在复杂模块或文件的开头，应添加注释说明其主要功能、用途。
    *   **函数/方法注释**: 对于公共函数、核心逻辑函数，应使用 JSDoc 或类似规范添加注释，说明其功能、参数、返回值和注意事项。
    *   **复杂逻辑注释**: 在代码中复杂的逻辑、算法或临时解决方案处，应添加行内或块级注释进行解释。

## 2. 项目文档大纲

以下为 `GradNote-FrontEnd` 项目推荐的文档结构大纲：

---

### **I. 项目概述 (Overview)**

*   **1.1. 项目简介**:
    *   项目目标和核心价值（例如：GradNote 错题管理系统前端）。
    *   主要功能模块简述。
*   **1.2. 技术选型**:
    *   核心框架: React (`react`, `react-dom`)
    *   路由管理: React Router (`react-router-dom`)
    *   状态管理: Zustand (`zustand`)
    *   UI 组件库: Ant Design (`antd`, `@ant-design/icons`)
    *   数据请求: Axios (`axios`)
    *   异步状态管理与缓存: TanStack Query (`@tanstack/react-query`)
    *   Markdown 与 LaTeX: `react-markdown`, `remark-math`, `rehype-katex`, `react-katex`, `katex`
    *   样式方案: Ant Design 样式 + （如有）Styled Components (`styled-components`) 或 CSS Modules。
    *   构建工具: Create React App (`react-scripts`)
*   **1.3. 目标用户**: （可选）简述项目的主要用户群体。

### **II. 快速开始 (Getting Started)**

*   **2.1. 环境要求**:
    *   Node.js 版本 (参考 `package.json` engines 或实际开发环境)
    *   npm / yarn / pnpm 包管理器
*   **2.2. 安装依赖**:
    ```bash
    npm install
    # 或者
    yarn install
    ```
*   **2.3. 运行开发环境**:
    ```bash
    npm start
    # 或者
    yarn start
    ```
    *   访问地址：`http://localhost:3000` (或 `.env` 中配置的端口)
*   **2.4. 构建生产包**:
    ```bash
    npm run build
    # 或者
    yarn build
    ```
*   **2.5. 环境变量配置**:
    *   说明 `.env.example` 文件的作用。
    *   列出关键环境变量及其含义：
        *   `REACT_APP_BACK_END_API_URL`: 后端 API 基础 URL。
        *   `REACT_APP_BACK_END_BASE_URL`: 后端服务器基础 URL (用于访问静态资源如图片)。
    *   强调如何在本地创建 `.env` 文件并进行配置。

### **III. 项目结构 (Project Structure)**

*   **3.1. 目录结构说明**:
    *   `/public`: 静态资源目录。
    *   `/src`: 源代码目录。
        *   `api/`: API 请求函数封装。
        *   `assets/`: (建议创建) 存放本地图片、字体等静态资源。
        *   `components/`: 可复用的 UI 组件。
            *   `common/`: (建议) 通用基础组件。
            *   `layout/`: (建议) 页面布局相关组件。
            *   `feature-specific/`: (建议) 特定功能模块的组件。
        *   `config.js`: 项目全局配置（如 API 地址常量）。
        *   `hooks/`: 自定义 React Hooks。
        *   `layouts/`: 页面布局骨架组件。
        *   `pages/`: 页面级组件（路由对应的组件）。
        *   `router.jsx`: 路由配置。
        *   `stores/`: Zustand 状态管理。
        *   `styles/`: 全局样式、主题配置、Ant Design 样式覆盖。
        *   `utils/`: 通用工具函数。
        *   `App.jsx`: 应用根组件。
        *   `index.js`: 应用入口文件，React Root 渲染。
        *   `queryClient.js`: TanStack Query 客户端实例配置。
    *   `.env.example`: 环境变量示例文件。
    *   `package.json`: 项目依赖和脚本配置。
    *   `document.md`: (本文档) 项目文档规范与大纲。
    *   (其他配置文件，如 `.gitignore`, `README.md` 等)

### **IV. 核心技术与规范 (Core Technologies & Conventions)**

*   **4.1. React & JSX**:
    *   组件类型：优先使用函数组件和 Hooks。
    *   命名规范：组件名使用帕斯卡命名法 (PascalCase)，文件名使用帕斯卡命名法或小驼峰命名法 (camelCase) (需统一)。
    *   Props 传递：明确 Props 类型（可考虑使用 PropTypes 或 TypeScript），避免层级过深的 Props drilling (可结合 Context 或 Zustand)。
*   **4.2. 状态管理 (Zustand)**:
    *   Store 结构：说明 `src/stores/` 下 Store 的组织方式（按功能模块划分）。
    *   State 设计：定义 State 的结构和类型。
    *   Actions 定义：异步 Action 的处理方式。
    *   Selectors 使用：如何创建和使用 Selectors 优化性能。
    *   中间件使用：(如有) 使用的 Zustand 中间件及其配置。
    *   [Zustand 官方文档](https://github.com/pmndrs/zustand)
*   **4.3. 数据请求与缓存 (Axios & TanStack Query)**:
    *   **Axios 封装**:
        *   说明 `src/api/` 目录下 Axios 实例的封装（请求/响应拦截器、基础 URL 配置、错误处理）。
        *   API 函数组织方式（按模块划分）。
        *   [Axios 官方文档](https://axios-http.com/)
    *   **TanStack Query 使用**:
        *   `queryClient.js` 配置说明：全局默认配置（如 `staleTime`, `cacheTime`）。
        *   `useQuery` 使用规范：定义 Query Keys 的规则、何时使用、数据获取逻辑。
        *   `useMutation` 使用规范：用于创建、更新、删除操作、乐观更新（如有）、错误处理、成功回调。
        *   缓存管理：说明缓存策略、手动失效缓存 (`invalidateQueries`) 的场景。
        *   [TanStack Query 官方文档](https://tanstack.com/query/latest/docs/react/overview)
*   **4.4. 路由管理 (React Router)**:
    *   `router.jsx` 配置说明：路由定义、嵌套路由、路由参数、懒加载 (Lazy Loading)。
    *   路由守卫/权限控制：(如有) 实现方式说明。
    *   编程式导航：`useNavigate` 的使用。
    *   [React Router 官方文档](https://reactrouter.com/en/main)
*   **4.5. UI 组件库 (Ant Design)**:
    *   按需加载配置：(通常 `react-scripts` 已处理)
    *   主题定制：说明如何在 `src/styles/` 或通过 `ConfigProvider` 定制 Ant Design 主题（Token）。
    *   全局配置：`ConfigProvider` 的使用（如国际化、主题）。
    *   常用组件封装：(如有) 对 Ant Design 常用组件进行的二次封装说明。
    *   [Ant Design 官方文档](https://ant.design/docs/react/introduce-cn)
*   **4.6. Markdown & LaTeX 支持**:
    *   说明 `react-markdown` 及相关插件 (`remark-math`, `rehype-katex`) 的配置和使用。
    *   `react-katex` 组件的使用方式。
    *   确保 `katex/dist/katex.min.css` 已正确引入。
*   **4.7. 样式方案**:
    *   全局样式：`src/styles/global.css` (或类似文件) 的作用。
    *   Ant Design 样式覆盖：在 `src/styles/` 下如何组织覆盖样式。
    *   组件局部样式：推荐的方案（如 CSS Modules, Styled Components - 如已使用）。
    *   样式变量：(如有) CSS 变量或预处理器变量的使用规范。

### **V. 组件文档 (Components Documentation)**

*   **5.1. 通用组件 (`src/components/common`)**:
    *   (对每个重要通用组件进行说明)
    *   组件名
    *   功能描述
    *   Props 列表 (名称、类型、是否必需、默认值、说明)
    *   使用示例 (Code Snippet)
*   **5.2. 布局组件 (`src/layouts` 或 `src/components/layout`)**:
    *   (对每个布局组件进行说明)
*   **5.3. 业务特定组件 (`src/components/feature-specific`)**:
    *   (按功能模块组织，对关键业务组件进行说明)

### **VI. 代码规范与质量 (Code Style & Quality)**

*   **6.1. 代码风格**:
    *   遵循 ESLint 和 Prettier (如果配置了) 的规范。
    *   命名规范（变量、函数、常量、类等）。
    *   注释规范（参考 1.3）。
*   **6.2. Linting & Formatting**:
    *   运行 `npm run lint` (如果配置了)。
    *   推荐配置编辑器插件进行自动格式化和 Lint 检查。
*   **6.3. 测试**:
    *   运行测试命令: `npm test` / `yarn test`。
    *   测试策略：单元测试、集成测试（如有）。
    *   测试覆盖率要求（如有）。

### **VII. 部署 (Deployment)**

*   **7.1. 构建流程**: `npm run build` / `yarn build`。
*   **7.2. 服务器配置**: (示例) Nginx 配置、静态文件服务。
*   **7.3. CI/CD**: (如有) 持续集成/持续部署流程说明。

### **VIII. 贡献指南 (Contribution Guide)**

*   **8.1. 分支策略**: (示例) Gitflow 或 GitHub Flow。
*   **8.2. Commit Message 规范**: (示例) Conventional Commits。
*   **8.3. Code Review流程**: Pull Request 要求。
*   **8.4. Bug 与 Issue 提报**: 如何报告问题。

### **IX. FAQ / 常见问题解答**

*   (收录开发过程中遇到的常见问题及其解决方案)

---

请根据项目的实际情况填充和完善上述大纲中的具体内容。
