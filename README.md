# GradNote 前端

GradNote是一个错题管理与学习工具，帮助学生记录、分析和复习错题，提高学习效率。

## 技术栈

- React
- React Router
- Axios
- React Context API

## 功能特性

- 用户认证（登录/注册）
- 错题记录与管理
- 知识点关联
- 图像处理（上传题目图片）

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

- 认证API
- 错题API
- 知识点API
- 解题API
- 图像处理API

详细API文档请参考`backend-api.md`。 