# GradNote前端重构记录

## 已完成的重构工作

1. **项目架构重构**
   - 创建了符合新规划的文件夹结构
   - 建立了基础的配置文件和核心组件

2. **技术栈迁移**
   - 从React Context API迁移到Zustand状态管理
   - 从直接使用axios迁移到TanStack Query
   - 从自定义CSS迁移到Ant Design + styled-components

3. **已重构组件**
   - 登录页面（LoginPage）- 已完成，保留了原有的视觉风格
   - 仪表盘页面（DashboardPage）- 已完成，严格按照UI原型设计实现
   - 布局组件（AuthLayout, MainLayout）
   - 图表组件（ChartBox, QuestionsChart, KnowledgeChart）
   - 错题提交页面（SubmissionDashboard）- 基本框架已完成
   - 知识点审核页面（KnowledgeReviewPage）- 基本框架已创建

4. **仪表盘页面重构（DashboardPage）**
   - **使用Zustand状态管理**：
     - 创建了专门的`dashboardStore.js`文件，集中管理仪表盘相关状态
     - 实现了数据获取逻辑的封装，移除了组件内部的直接API调用
     - 添加了加载状态和错误状态管理
   - **连接后端真实API**：
     - 重构`dashboard.service.js`，删除假数据，使用后端实际API
     - 实现了根据真实API格式的数据处理和转换函数
     - 添加了数据过滤和时间范围处理
   - **UI组件完善**：
     - 新增`KnowledgeChart`环形饼图，严格匹配设计稿
     - 升级`QuestionsChart`为线型图，支持多科目数据对比
     - 优化`ChartBox`样式和交互，支持更灵活的标题和控件
   - **提取业务逻辑**：
     - 创建`useDashboard`自定义Hook，封装仪表盘页面的业务逻辑
     - 简化了组件代码，提高了可维护性
     - 实现了科目选项的动态加载

5. **错题提交功能开发**
   - **组件开发**：
     - 完成`StepIndicator`组件，支持多种状态显示和交互
     - 完成`ImageUploader`组件，支持图片上传和验证
     - 完成`SubmissionRow`组件，展示单个错题的处理流程和状态
     - 完成`StepDetailsModal`组件，显示步骤详情和编辑功能
     - 完成`DetailsModal`组件框架，用于展示错题完整信息
   - **API服务层开发**：
     - 完成`image.service.js`，实现图片处理相关API
     - 完成`question.service.js`，实现错题管理相关API
     - 完成`knowledge.service.js`，实现知识点相关API
     - 完成`solving.service.js`，实现解题相关API
   - **自定义Hook开发**：
     - 完成`useSubmission` Hook，封装错题提交流程的业务逻辑
     - 实现了完整的错题提交流程状态管理

## 代码质量优化

根据代码质量审查报告，完成了以下优化工作：

1. **TanStack Query配置优化**
   - 添加了更灵活的重试策略，基于错误类型智能处理
   - 实现了全局错误处理机制，对不同错误类型给予不同处理
   - 添加了日志记录功能，便于调试和追踪问题
   - 在开发环境添加了查询状态监控功能
   - 为LLM相关API调用设置了更长的超时时间

2. **API服务层优化**
   - 创建了全局配置文件(config.js)，集中管理API基础URL和其他配置
   - 优化了axios配置，添加了Token自动刷新机制
   - 优化了错误处理，针对不同HTTP状态码给出友好提示
   - 改进了API参数处理，支持更灵活的查询选项
   - 完善了所有服务层模块，包括image.service.js、question.service.js、knowledge.service.js和solving.service.js
   - 添加了参数验证和数据转换逻辑，提高API调用的健壮性

3. **本地存储工具优化**
   - 添加了异常处理，增强了代码健壮性
   - 添加了存储前缀配置，便于多应用部署
   - 增加了对刷新Token的支持，提高安全性
   - 优化了读写操作，处理可能的JSON解析错误

4. **Zustand状态管理优化**
   - 添加了持久化存储功能
   - 增强了错误处理机制
   - 添加了类型定义注释，提高代码可读性和安全性
   - 扩展了认证方法，支持刷新Token
   - 新增dashboardStore，实现仪表盘状态管理的集中化
   - 新增submissionStore，实现错题提交实例的状态管理和持久化

5. **组件优化**
   - 登录页面增加了更细致的错误处理和表单验证，保留了原有视觉风格
   - 仪表盘页面添加了性能优化（useMemo, useCallback）
   - 添加了测试ID属性，方便自动化测试
   - 改进了UI交互，如添加科目筛选和更多数据展示
   - 图表组件严格按照设计原型实现，包括颜色、图标和布局
   - 错题提交组件添加了友好的加载状态和错误处理

## 下一步重构计划

1. **功能页面完善**
   - 完善错题提交页面（SubmissionDashboard）的交互逻辑
   - 完成知识点审核页面（KnowledgeReviewPage）的功能实现

2. **组件开发**
   - 完成KnowledgePointSelector组件
   - 完成SolutionViewer组件的完整功能

3. **自定义Hook开发**
   - 开发useKnowledgeReview Hook，用于知识点审核页面

4. **状态管理优化**
   - 优化错题提交流程中的状态隔离，确保多个并发提交互不影响
   - 完善错题提交任务的持久化存储

5. **安全性与测试增强**
   - 实现CSRF保护
   - 添加输入验证和消毒处理
   - 开发单元测试和集成测试
   - 实现更安全的认证机制

## 下次工作重点

1. **完善错题提交流程**
   - 实现KnowledgePointSelector组件，支持用户选择和查看知识点
   - 完善解题过程展示功能，实现SolutionViewer组件
   - 优化错题提交流程的用户体验，包括加载状态和错误处理

2. **开发知识点审核页面**
   - 实现知识点列表展示
   - 实现知识点标记功能
   - 实现知识点确认和提交功能

3. **性能优化**
   - 优化图片上传和处理流程
   - 实现更高效的状态管理
   - 添加缓存策略，减少不必要的API调用

### GradNote 前端开发进展总结

**技术栈:** React, Axios, Zustand, **TanStack Query (React Query - 服务器状态管理)**, UI 库 (Ant Design)

**当前完成情况:**

1. **基础架构与配置**
   - 项目初始化与目录结构搭建已完成
   - 所有核心依赖已安装并配置
   - 路由系统已完成配置

2. **核心功能实现**
   - 登录页面已完成
   - 仪表盘页面已完成
   - 错题提交页面基本框架已完成
   - 知识点审核页面基本框架已创建

3. **API服务层**
   - 所有核心API服务模块已实现
   - 已实现错误处理和超时策略
   - 已实现Token管理和认证机制

4. **状态管理**
   - 已实现基于Zustand的状态管理
   - 已实现基于TanStack Query的服务器状态管理
   - 已实现状态持久化存储

**核心页面/组件:**

1.  **`SubmissionDashboard` (错题提交页面):**
    *   主布局，包含侧边栏和内容区。
    *   管理多个错题提交实例的状态。
    *   包含图片上传区域 (`ImageUploader`)。
    *   渲染 `SubmissionRow` 列表。
2.  **`ImageUploader`:**
    *   处理文件选择和拖拽上传。
    *   触发新的 `SubmissionRow` 创建和上传流程。
3.  **`SubmissionRow` (单行提交流程):**
    *   展示单个错题的处理流程和状态（从 OCR 开始）。
    *   包含多个 `StepIndicator` 组件。
    *   管理该行错题的独立状态 (当前步骤、数据、错误信息等)。
    *   包含 "详情" 按钮，触发 `DetailsModal`。
4.  **`StepIndicator` (步骤指示器):**
    *   显示单个步骤的图标、名称和状态（待处理、处理中、成功、失败）。
    *   可点击，用于显示该步骤的详细信息或错误原因 (`StepDetailsModal`)。
    *   处理 OCR、答案步骤的可编辑状态和重启逻辑。
5.  **`StepDetailsModal` (步骤详情弹窗):**
    *   显示特定步骤的返回数据或错误信息。
    *   对于 OCR 和答案步骤，提供编辑功能。
6.  **`KnowledgePointSelector` (知识点选择器):**
    *   (在解题流程中使用)
    *   展示 `analyze-from-question` 和 `search` 返回的知识点。
    *   允许用户查看、选择用于解题的知识点。
7.  **`SolutionViewer` (解题过程查看器):**
    *   (可能在 `StepDetailsModal` 或 `DetailsModal` 中使用)
    *   展示 `/api/v1/solving/{question_id}` 返回的解题步骤和审查结果。
8.  **`DetailsModal` (错题详情弹窗):**
    *   通过 "详情" 按钮触发。
    *   展示错题的完整信息 (OCR 内容、答案、图片、解题过程等)。
9.  **`KnowledgeReviewPage` (知识点审核页面):**
    *   独立页面，展示待审核的知识点列表。
    *   显示错题的图片、文本和相关知识点列表（分为"已有知识点"和"新知识点"两部分）。
    *   提供知识点标记功能，允许用户确认或放弃对知识点的标记。
    *   调用 `/api/v1/knowledge/mark-confirmed` 完成知识点标记。

**状态管理:**

*   **Zustand:** 管理纯粹的客户端 UI 状态（如模态框可见性、表单输入值、全局设置等）以及错题提交实例列表本身。
    *   **持久化:** 使用 Zustand 的 `persist` 中间件将 **错题提交任务列表** 及其关键 **客户端状态** 保存到 `localStorage`。**具体持久化内容包括：** 每个提交实例的用户界面状态（如进行到哪一步）、关联的 `question_id` (如果已创建)、用户未提交的 OCR 或答案编辑内容、原始图片文件的引用或元数据（以便在刷新后重新显示图片预览，注意避免直接存储大文件）。**不应持久化 TanStack Query 的服务器数据缓存。**
*   **TanStack Query (React Query):** 管理所有与后端 API 交互相关的服务器状态。包括：
    *   每个错题提交流程中各个异步步骤（OCR、答案识别、知识点分析、解题等）的加载状态、错误状态、返回数据和缓存。
    *   自动处理重试、后台同步、数据失效等。
    *   **错误处理:** 必须在 `useQuery` 和 `useMutation` Hooks 中添加健壮的 `onError` 回调，捕获 API 请求或处理过程中的错误，并将清晰、友好的错误信息展示给用户（例如，在对应的 `StepIndicator` 上显示错误图标，并在 `StepDetailsModal` 中提供详细错误信息）。
    *   **加载状态:** 必须利用 TanStack Query 提供的状态标志 (如 `isLoading`, `isPending`, `isFetching`)，在界面上（如 `StepIndicator` 或按钮上）为用户提供明确的视觉反馈，告知当前操作正在进行中。
*   `SubmissionRow` 组件将主要使用 TanStack Query 的 Hooks (`useQuery`, `useMutation`) 来触发 API 调用并获取其状态，而不是在 Zustand 中手动管理这些异步状态。

**API 服务层:**

*   创建 Axios 实例，配置基础 URL 和请求拦截器（注入 Token）。
*   为 `openapi.json` 中的相关端点创建类型安全的请求函数（这些函数将作为 TanStack Query Hooks 的 `queryFn` 或 `mutationFn`）。
    *   `image.service.ts`: `processImage`, `processAnswerImage`
    *   `knowledge.service.ts`: `analyzeFromQuestion`, `searchKnowledgePoints`, `markConfirmedKnowledge`, `getKnowledgePointById` 等。
    *   `question.service.ts`: `createQuestion`, `getQuestionById`, `updateQuestion`, `deleteQuestion`。
    *   `solving.service.ts`: `solveQuestion`。
    *   `auth.service.ts`: `login`, `register`。
*   TanStack Query 将负责调用这些服务函数，并管理相关的服务器状态和缓存。

**开发步骤:**

1.  **环境搭建与基础组件:**
    *   初始化 React 项目 (e.g., Vite + React + javaScript)。
    *   集成 UI 库 (Ant Design)。
    *   设置 Zustand 和 **TanStack Query** (包括 `QueryClientProvider`)。
    *   实现基础布局和路由 (包括错题提交页和知识点审核页)。
    *   实现认证流程 (登录/注册页面 - `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, Token 存储, Axios 拦截器)。
2.  **错题提交页面 (`SubmissionDashboard`):**
    *   实现 `ImageUploader` 组件，处理图片选择和基础验证。
    *   实现 `SubmissionRow` 组件的基本结构和状态管理。
    *   实现 `StepIndicator` 组件的基本样式和状态显示 (从 OCR 步骤开始)。
3.  **实现提交流程 - 步骤 1 (OCR):**
    *   `ImageUploader` 触发上传。在 `SubmissionRow` 中使用 TanStack Query 的 `useMutation` Hook 包装 `image.service.processImage` (**`POST /api/v1/image/process`**) 来处理上传和状态管理 (isLoading, isError, data, error)。
    *   根据 `useMutation` 返回的状态更新 "OCR" `StepIndicator`（显示加载、成功、失败状态）。
    *   **成功回调 (`onSuccess`):** 在 OCR 成功后，**立即使用返回的 `text` 和 `image_url` 调用另一个 `useMutation` (包装 `question.service.createQuestion` - **`POST /api/v1/questions/`**) 来创建错题记录**，并将返回的 `question_id` 保存到该 `SubmissionRow` 的 Zustand 状态或 React state 中，用于后续步骤。
    *   实现 `StepDetailsModal` 显示 OCR 结果 (来自 `useMutation` 的 `data`) 或错误信息 (来自 `error`)。
    *   实现 OCR 步骤的编辑功能。编辑后使用 `useMutation` 包装 `question.service.updateQuestion` (**`PUT /api/v1/questions/{question_id}`**) (使用已获取的 `question_id`)，并在 `onSuccess` 回调中触发后续 TanStack Query 查询的失效 (invalidate) 来重启流程。
4.  **实现提交流程 - 步骤 2 (答案识别/编辑):**
    *   在 OCR 成功（并已创建 `question` 记录）后，在 `SubmissionRow` 中使用 `useMutation` 包装 `image.service.processAnswerImage` (**`POST /api/v1/image/process-answer`**)。
    *   根据 `useMutation` 状态更新 "是否存在答案" `StepIndicator`。
    *   允许用户在 `StepDetailsModal` 中查看/编辑答案。
    *   **编辑/确认答案后:** 使用 `useMutation` 包装 `question.service.updateQuestion` (**`PUT /api/v1/questions/{question_id}`**) (使用已获取的 `question_id`) 将答案更新到后端，并在 `onSuccess` 回调中触发后续查询失效（如果需要）。
5.  **实现提交流程 - 步骤 3 (知识点检索):**
    *   在 OCR/答案确认后 (确保 `question` 记录存在且包含必要信息)，使用 `useMutation` 包装 `knowledge.service.analyzeFromQuestion` (**`POST /api/v1/knowledge/analyze-from-question`**) 来触发知识点类别分析。
    *   在其 `onSuccess` 回调中，使用获取的类别触发另一个 `useQuery` (包装 `knowledge.service.searchKnowledgePoints` - **`GET /api/v1/knowledge/search`**) 来获取具体知识点列表。
    *   根据查询状态更新 "检索相关知识点" `StepIndicator`。
    *   实现 `KnowledgePointSelector` 显示 `useQuery` 返回的数据。
6.  **实现提交流程 - 步骤 4 (解题):**
    *   使用步骤3检索到的相关知识点和步骤1的错题记录 `question_id` 调用后端 API，使用 `useMutation` 包装 `solving.service.solveQuestion` (**`POST /api/v1/solving/{question_id}`**)。
    *   根据 `useMutation` 状态更新 "解题" `StepIndicator`。提供加载和错误反馈。
    *   **处理结果:** `onSuccess` 回调中，处理 `useMutation` 返回的 `data` (`SolveResponse`)，包含解题过程 (`solution`) 和审查结果。
    *   在 `StepDetailsModal` 或 `DetailsModal` 中实现 `SolutionViewer`，用于展示解题过程 (`solution`) 和审查结果。
7.  **实现提交流程 - 步骤 5 (返回知识点标记列表):**
    *   知识点列表分为已存在知识点和新增知识点。已存在知识点已经在步骤3中获取，新增知识点需要调用(**`POST /api/v1/knowledge/extract-from-solution`**)
    *   在 `SubmissionRow` 或 `StepDetailsModal` 中显示提取到的知识点列表，作为参考信息。
    *   根据提取结果更新 "返回知识点标记列表" `StepIndicator`。提供加载和错误反馈。
    *   **完成提交:** 至此，错题提交流程结束。完整的知识点审核和确认将在专门的"知识点审核"页面中进行。
8.  **实现知识点审核页面 (`KnowledgeReviewPage`):**
    *   使用 `useQuery` 包装 `question.service.getQuestions` (**`GET /api/v1/questions/`**) 获取用户的错题列表。
    *   展示每个错题及其已提取的知识点列表（在步骤5中获取的）。如果尚未提取，可以在此页面中触发提取。
    *   实现知识点显示和标记界面，允许用户逐个确认或放弃对知识点的标记。
    *   使用 `useMutation` 包装 `knowledge.service.markConfirmedKnowledge` (**`POST /api/v1/knowledge/mark-confirmed`**) 将用户确认的知识点（existing_knowledge_point_ids 和 new_knowledge_points）发送到后端进行标记。
    *   实现标记状态的视觉反馈和确认功能。
9.  **实现详情功能:**
    *   在错题提交页中，实现 `DetailsModal`，聚合展示错题的完整信息 (OCR 文本、答案、图片、解题过程、提取的知识点等)。可以利用 TanStack Query 的缓存数据 (例如调用 **`GET /api/v1/questions/{question_id}`** 获取最新错题信息)。
    *   在知识点审核页中，允许用户查看完整的错题和解题过程详情。
10.  **完善与测试:**
    *   实现完整的流程重启逻辑（主要通过 TanStack Query 的查询失效机制）。
    *   UI 细节打磨和样式统一。
    *   全面的错误处理和用户提示（**确保所有 API 调用都有对应的加载和错误状态反馈**）。
    *   添加单元测试和集成测试。
