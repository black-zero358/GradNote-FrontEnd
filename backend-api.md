# GradNote API 文档

**版本:** 0.1.0
**描述:** 错题知识点管理系统 API

## 基础信息

* **OpenAPI 版本:** 3.1.0
* **认证方式:** OAuth2 Password Bearer (通过 `/api/v1/auth/login` 获取 `access_token`)

## 认证 (Auth)

### 1. 登录获取访问令牌

* **端点:** `POST /api/v1/auth/login`
* **标签:** `认证`
* **摘要:** Login For Access Token
* **请求体:** (`application/x-www-form-urlencoded`, **必需**)
    * `username` (string, **必需**)
    * `password` (string, **必需**)
    * `grant_type` (string, 可选, 默认为 `password`): 必须是 "password"
    * `scope` (string, 可选, 默认 "")
    * `client_id` (string | null, 可选)
    * `client_secret` (string | null, 可选)
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** `Token`
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

### 2. 注册用户

* **端点:** `POST /api/v1/auth/register`
* **标签:** `认证`
* **摘要:** Register User
* **请求体:** (`application/json`, **必需**)
    * **模式:** `UserCreate`
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** `User`
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

## 错题 (Questions)

*(需要认证)*

### 1. 创建新错题

* **端点:** `POST /api/v1/questions/`
* **标签:** `错题`
* **摘要:** Create Question
* **描述:** 创建新错题
* **认证:** OAuth2PasswordBearer
* **请求体:** (`application/json`, **必需**)
    * **模式:** `QuestionCreate`
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** `Question`
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

### 2. 获取错题列表

* **端点:** `GET /api/v1/questions/`
* **标签:** `错题`
* **摘要:** Read Questions
* **描述:** 获取当前用户的错题列表
* **认证:** OAuth2PasswordBearer
* **查询参数:**
    * `skip` (integer, 可选, 默认 0): 跳过的记录数
    * `limit` (integer, 可选, 默认 100): 返回的最大记录数
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** Array[`Question`]
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

### 3. 获取特定错题详情

* **端点:** `GET /api/v1/questions/{question_id}`
* **标签:** `错题`
* **摘要:** Read Question
* **描述:** 获取特定错题详情
* **认证:** OAuth2PasswordBearer
* **路径参数:**
    * `question_id` (integer, **必需**): 错题 ID
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** `Question`
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

### 4. 更新错题

* **端点:** `PUT /api/v1/questions/{question_id}`
* **标签:** `错题`
* **摘要:** Update Question
* **描述:** 更新错题
* **认证:** OAuth2PasswordBearer
* **路径参数:**
    * `question_id` (integer, **必需**): 错题 ID
* **请求体:** (`application/json`, **必需**)
    * **模式:** `QuestionUpdate`
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** `Question`
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

### 5. 删除错题

* **端点:** `DELETE /api/v1/questions/{question_id}`
* **标签:** `错题`
* **摘要:** Delete Question
* **描述:** 删除错题
* **认证:** OAuth2PasswordBearer
* **路径参数:**
    * `question_id` (integer, **必需**): 错题 ID
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** `Question` (通常返回被删除的对象)
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

## 知识点 (Knowledge Points)

### 1. 创建新知识点

* **端点:** `POST /api/v1/knowledge/`
* **标签:** `知识点`
* **摘要:** Create Knowledge Point
* **描述:** 创建新的知识点
* **认证:** OAuth2PasswordBearer
* **请求体:** (`application/json`, **必需**)
    * **模式:** `KnowledgePointCreate`
* **响应:**
    * `201 Created`: 成功响应
        * **内容:** `application/json`
        * **模式:** `KnowledgePoint`
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

### 2. 基于结构化信息查询知识点

* **端点:** `GET /api/v1/knowledge/structure`
* **标签:** `知识点`
* **摘要:** Get Knowledge Points By Structure
* **描述:** 基于结构化信息（科目、章节、小节）查询知识点
* **查询参数:**
    * `subject` (string, **必需**): 科目
    * `chapter` (string | null, 可选): 章节
    * `section` (string | null, 可选): 小节
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** Array[`KnowledgePoint`]
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

### 3. 按条件搜索知识点

* **端点:** `GET /api/v1/knowledge/search`
* **标签:** `知识点`
* **摘要:** Search Knowledge Points
* **描述:** 按条件搜索知识点
* **查询参数:**
    * `subject` (string | null, 可选): 科目
    * `chapter` (string | null, 可选): 章节
    * `section` (string | null, 可选): 小节
    * `item` (string | null, 可选): 知识点名称（支持模糊搜索）
    * `sort_by` (string | null, 可选): 排序字段，例如：`mark_count`, `created_at`
    * `skip` (integer, 可选, 默认 0): 跳过的记录数
    * `limit` (integer, 可选, 默认 100): 返回的最大记录数
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** Array[`KnowledgePoint`]
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

### 4. 获取热门知识点

* **端点:** `GET /api/v1/knowledge/popular`
* **标签:** `知识点`
* **摘要:** Get Popular Knowledge Points
* **描述:** 获取最热门的知识点（根据标记次数）
* **查询参数:**
    * `limit` (integer, 可选, 默认 10): 返回的记录数
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** Array[`KnowledgePoint`]
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

### 5. 获取所有科目列表

* **端点:** `GET /api/v1/knowledge/subjects`
* **标签:** `知识点`
* **摘要:** Get Subjects
* **描述:** 获取所有科目列表
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** Array[`string`]

### 6. 获取指定科目的所有章节

* **端点:** `GET /api/v1/knowledge/chapters`
* **标签:** `知识点`
* **摘要:** Get Chapters
* **描述:** 获取指定科目的所有章节
* **查询参数:**
    * `subject` (string, **必需**): 科目名称
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** Array[`string`]
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

### 7. 获取指定科目和章节的所有小节

* **端点:** `GET /api/v1/knowledge/sections`
* **标签:** `知识点`
* **摘要:** Get Sections
* **描述:** 获取指定科目和章节的所有小节
* **查询参数:**
    * `subject` (string, **必需**): 科目名称
    * `chapter` (string, **必需**): 章节名称
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** Array[`string`]
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

### 8. 获取当前用户的所有标记

* **端点:** `GET /api/v1/knowledge/user-marks`
* **标签:** `知识点`
* **摘要:** Get User Marks
* **描述:** 获取当前用户的所有标记
* **认证:** OAuth2PasswordBearer
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** Array[`Mark`]

### 9. 根据ID获取知识点详情

* **端点:** `GET /api/v1/knowledge/{knowledge_point_id}`
* **标签:** `知识点`
* **摘要:** Get Knowledge Point
* **描述:** 根据ID获取知识点详情
* **路径参数:**
    * `knowledge_point_id` (integer, **必需**): 知识点 ID
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** `KnowledgePoint`
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

### 10. 增加知识点标记次数 (Mark)

* **端点:** `POST /api/v1/knowledge/mark/{knowledge_point_id}`
* **标签:** `知识点`
* **摘要:** Mark Knowledge Point
* **描述:** 增加知识点标记次数 (注意：此接口可能仅增加全局计数，具体用户标记需调用 `create_user_mark`)
* **认证:** OAuth2PasswordBearer
* **路径参数:**
    * `knowledge_point_id` (integer, **必需**): 知识点 ID
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** `KnowledgePoint` (返回更新后的知识点)
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

### 11. 创建用户知识点标记记录

* **端点:** `POST /api/v1/knowledge/user-mark`
* **标签:** `知识点`
* **摘要:** Create User Mark
* **描述:** 创建用户知识点标记记录
* **认证:** OAuth2PasswordBearer
* **请求体:** (`application/json`, **必需**)
    * **模式:** `MarkCreate`
* **响应:**
    * `201 Created`: 成功响应
        * **内容:** `application/json`
        * **模式:** `Mark`
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

### 12. 分析题目文本提取知识点类别

* **端点:** `POST /api/v1/knowledge/analyze-from-question`
* **标签:** `知识点`
* **摘要:** Analyze Knowledge From Question
* **描述:** 分析题目文本，返回可能的知识点类别（科目、章节、小节）
* **请求体:** (`application/json`, **必需**)
    * **模式:** `KnowledgeAnalyzeRequest`
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** `KnowledgeAnalyzeResponse`
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

### 13. 从解题过程中提取知识点

* **端点:** `POST /api/v1/knowledge/extract-from-solution`
* **标签:** `知识点`
* **摘要:** Extract Knowledge From Solution
* **描述:** 从解题过程中提取使用的知识点，区分“已有知识点”和“新知识点”
* **请求体:** (`application/json`, **必需**)
    * **模式:** `KnowledgeExtractRequest`
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** `KnowledgeExtractResponse`
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

### 14. 处理用户确认的知识点标记

* **端点:** `POST /api/v1/knowledge/mark-confirmed`
* **标签:** `知识点`
* **摘要:** Mark Confirmed Knowledge Points
* **描述:** 处理用户确认的知识点标记，包括已有知识点和新知识点。关联知识点到指定错题。
* **认证:** OAuth2PasswordBearer
* **请求体:** (`application/json`, **必需**)
    * **模式:** `KnowledgeMarkRequest`
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** `KnowledgeMarkResponse`
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

## 解题 (Solving)

*(需要认证)*

### 1. 解答错题

* **端点:** `POST /api/v1/solving/{question_id}`
* **标签:** `解题`
* **摘要:** Solve Question
* **描述:** 解答错题。需要提供相关知识点 ID。
* **认证:** OAuth2PasswordBearer
* **路径参数:**
    * `question_id` (integer, **必需**): 错题 ID
* **请求体:** (`application/json`, **必需**)
    * **模式:** `SolveRequest`
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** `SolveResponse`
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

## 图像处理 (Image Processing)

*(需要认证)*

### 1. 处理错题图像并提取文本

* **端点:** `POST /api/v1/image/process`
* **标签:** `图像处理`
* **摘要:** Process Image
* **描述:** 处理错题图像并提取文本。此 API 仅返回处理结果，不创建错题记录。
* **认证:** OAuth2PasswordBearer
* **请求体:** (`multipart/form-data`, **必需**)
    * `file` (binary, **必需**): 要处理的图像文件
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** `ImageProcessingResponse`
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

### 2. 处理错题图像并提取答案文本

* **端点:** `POST /api/v1/image/process-answer`
* **标签:** `图像处理`
* **摘要:** Process Answer Image
* **描述:** 处理错题图像并提取答案文本。此 API 仅返回处理结果，不创建错题记录。
* **认证:** OAuth2PasswordBearer
* **请求体:** (`multipart/form-data`, **必需**)
    * `file` (binary, **必需**): 要处理的图像文件
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json`
        * **模式:** `ImageProcessingResponse` (结构同上，`text` 字段包含答案文本)
    * `422 Unprocessable Entity`: 验证错误
        * **内容:** `application/json`
        * **模式:** `HTTPValidationError`

## 其他 (Other)

### 1. 根路径

* **端点:** `GET /`
* **摘要:** Root
* **描述:** API 根路径，通常用于简单连接测试。
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json` (空对象 `{}` 或欢迎信息)

### 2. 健康检查

* **端点:** `GET /health`
* **摘要:** Health Check
* **描述:** 用于检查 API 服务是否正常运行。
* **响应:**
    * `200 OK`: 成功响应
        * **内容:** `application/json` (通常包含状态信息，如 `{"status": "ok"}` 或空对象 `{}`)

## 数据模型 (Schemas)

### Token
* `access_token` (string, **必需**): 访问令牌
* `token_type` (string, **必需**, 默认 "bearer"): 令牌类型

### UserCreate
* `username` (string, **必需**)
* `email` (string (email format) | null, 可选)
* `password` (string, **必需**)

### User
* `username` (string, **必需**)
* `email` (string (email format) | null, 可选)
* `id` (integer, **必需**): 用户 ID
* `created_at` (string (date-time format), **必需**): 创建时间

### QuestionCreate
* `content` (string, **必需**): 错题内容
* `subject` (string | null, 可选): 科目
* `solution` (string | null, 可选): 解题过程
* `answer` (string | null, 可选): 答案
* `remark` (string | null, 可选): 备注
* `image_url` (string | null, 可选): 图像 URL

### Question
* `content` (string, **必需**): 错题内容
* `subject` (string | null, 可选): 科目
* `solution` (string | null, 可选): 解题过程
* `answer` (string | null, 可选): 答案
* `remark` (string | null, 可选): 备注
* `id` (integer, **必需**): 错题 ID
* `user_id` (integer, **必需**): 所属用户 ID
* `image_url` (string | null, 可选): 图像 URL
* `created_at` (string (date-time format), **必需**): 创建时间

### QuestionUpdate
* `subject` (string | null, 可选): 科目
* `content` (string | null, 可选): 错题内容
* `solution` (string | null, 可选): 解题过程
* `answer` (string | null, 可选): 答案
* `remark` (string | null, 可选): 备注
* `image_url` (string | null, 可选): 图像 URL

### KnowledgePointCreate
* `subject` (string, **必需**): 科目
* `chapter` (string, **必需**): 章节
* `section` (string, **必需**): 小节
* `item` (string, **必需**): 知识点条目名称
* `details` (string | null, 可选): 知识点详情

### KnowledgePoint
* `subject` (string, **必需**): 科目
* `chapter` (string, **必需**): 章节
* `section` (string, **必需**): 小节
* `item` (string, **必需**): 知识点条目名称
* `details` (string | null, 可选): 知识点详情
* `id` (integer, **必需**): 知识点 ID
* `mark_count` (integer, **必需**): 被标记次数
* `created_at` (string (date-time format), **必需**): 创建时间

### MarkCreate
* `knowledge_point_id` (integer, **必需**): 关联的知识点 ID
* `question_id` (integer, **必需**): 关联的错题 ID

### Mark
* `knowledge_point_id` (integer, **必需**): 关联的知识点 ID
* `question_id` (integer, **必需**): 关联的错题 ID
* `id` (integer, **必需**): 标记记录 ID
* `user_id` (integer, **必需**): 所属用户 ID
* `marked_at` (string (date-time format), **必需**): 标记时间

### KnowledgeAnalyzeRequest
* `question_text` (string, **必需**): 需要分析的题目文本

### KnowledgeAnalyzeResponse
* `categories` (Array[`KnowledgeCategory`], **必需**): 分析出的知识点类别列表

### KnowledgeCategory
* `subject` (string, **必需**): 科目
* `chapter` (string, **必需**): 章节
* `section` (string, **必需**): 小节

### KnowledgeExtractRequest
* `question_text` (string, **必需**): 题目文本
* `solution_text` (string, **必需**): 解题过程文本
* `existing_knowledge_point_ids` (Array[integer] | null, 可选): 已知的知识点 ID 列表

### KnowledgeExtractResponse
* `existing_knowledge_points` (Array[`KnowledgePoint`], 默认 []): 已存在的知识点列表
* `new_knowledge_points` (Array[`KnowledgePointInfo`], 默认 []): 新识别的知识点信息列表

### KnowledgePointInfo
* `subject` (string, **必需**): 科目
* `chapter` (string, **必需**): 章节
* `section` (string, **必需**): 小节
* `item` (string, **必需**): 知识点条目名称
* `details` (string | null, 可选): 知识点详情
* `is_existing` (boolean, 默认 false): 是否是已存在的知识点 (此字段似乎用于前端展示区分，后端可能不直接使用)

### KnowledgeMarkRequest
* `question_id` (integer, **必需**): 要关联的错题 ID
* `existing_knowledge_point_ids` (Array[integer], 默认 []): 确认标记的已存在知识点 ID 列表
* `new_knowledge_points` (Array[`KnowledgePointInfo`], 默认 []): 确认创建并标记的新知识点列表

### KnowledgeMarkResponse
* `question_id` (integer, **必需**): 关联的错题 ID
* `marked_knowledge_points` (Array[`KnowledgePoint`], **必需**): 已标记的所有知识点（包括新创建的）

### SolveRequest
* `knowledge_points` (Array[integer], **必需**): 用于解题的知识点 ID 列表

### SolveResponse
* `status` (string, **必需**): 解题状态 ("success", "error", etc.)
* `message` (string, **必需**): 状态信息
* `data` (`SolveResult` | null): 解题结果数据 (成功时)

### SolveResult
* `question` (string, **必需**): 原始问题 (或其标识)
* `solution` (string, **必需**): 生成的解题步骤
* `review_passed` (boolean | null, 可选): 审核是否通过 (可能用于后续人工或自动审核)
* `review_reason` (string | null, 可选): 审核意见
* `knowledge_points` (Array[`KnowledgePoint`], **必需**): 解题过程中使用的知识点

### ImageProcessingResponse
* `status` (string, **必需**): 处理状态 (例如 "success", "error")
* `text` (string | null, 可选): 从图像中提取的文本
* `image_url` (string | null, 可选): 保存后的图像 URL
* `message` (string | null, 可选): 错误信息 (仅当 status 为 error 时)
* `error_code` (string | null, 可选): 错误代码 (仅当 status 为 error 时)
    * 可能的错误代码: `IMAGE_SIZE_EXCEEDED`, `IMAGE_FORMAT_ERROR`, `INVALID_IMAGE_DATA`, `INVALID_IMAGE_PATH`, `IMAGE_READ_ERROR`, `API_ERROR`, `PROCESSING_ERROR`, `UNKNOWN_ERROR`

### HTTPValidationError
* `detail` (Array[`ValidationError`], 可选): 错误的详细信息列表

### ValidationError
* `loc` (Array[string | integer], **必需**): 错误发生的位置 (例如 `["body", "username"]`)
* `msg` (string, **必需**): 错误信息
* `type` (string, **必需**): 错误类型 (例如 "value_error")

