# API 接口规范

## 1. 基础信息

- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`
- **字符编码**: UTF-8

## 2. 通用响应格式

### 2.1 成功响应

```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

### 2.2 错误响应

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

### 2.3 HTTP 状态码

| 状态码 | 含义 | 使用场景 |
|--------|------|----------|
| 200 | OK | GET、PATCH请求成功 |
| 201 | Created | POST创建成功 |
| 204 | No Content | DELETE删除成功 |
| 400 | Bad Request | 请求参数校验失败 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器内部错误 |

---

## 3. 接口详情

### 3.1 获取所有代码片段

```
GET /api/snippets
```

**Query 参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| language | string | 否 | 按编程语言筛选 |
| tags | string | 否 | 按标签筛选，多个标签用逗号分隔 |

**请求示例：**

```bash
curl "http://localhost:3000/api/snippets?language=javascript&tags=react,hooks"
```

**成功响应（200）：**

```json
{
  "success": true,
  "data": [
    {
      "id": "6598a1b2c3d4e5f6a7b8c9d0",
      "title": "React useEffect 基础用法",
      "language": "javascript",
      "tags": ["react", "hooks"],
      "description": "useEffect 的基本使用模式",
      "code": "useEffect(() => {\n  // 副作用逻辑\n  return () => {\n    // 清理逻辑\n  };\n}, [deps]);",
      "createdAt": "2024-01-15T08:30:00.000Z",
      "updatedAt": "2024-01-15T08:30:00.000Z"
    }
  ],
  "message": "获取成功"
}
```

---

### 3.2 搜索代码片段

```
GET /api/snippets/search
```

**Query 参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 是 | 搜索关键词 |

**请求示例：**

```bash
curl "http://localhost:3000/api/snippets/search?keyword=useEffect"
```

**成功响应（200）：**

```json
{
  "success": true,
  "data": [
    {
      "id": "6598a1b2c3d4e5f6a7b8c9d0",
      "title": "React useEffect 基础用法",
      "language": "javascript",
      "tags": ["react", "hooks"],
      "description": "useEffect 的基本使用模式",
      "code": "useEffect(() => {\n  console.log('effect');\n}, []);",
      "createdAt": "2024-01-15T08:30:00.000Z",
      "updatedAt": "2024-01-15T08:30:00.000Z"
    }
  ],
  "message": "搜索成功"
}
```

**无结果响应（200）：**

```json
{
  "success": true,
  "data": [],
  "message": "未找到匹配的代码片段"
}
```

---

### 3.3 获取单个代码片段

```
GET /api/snippets/:id
```

**Path 参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | MongoDB ObjectId |

**请求示例：**

```bash
curl "http://localhost:3000/api/snippets/6598a1b2c3d4e5f6a7b8c9d0"
```

**成功响应（200）：**

```json
{
  "success": true,
  "data": {
    "id": "6598a1b2c3d4e5f6a7b8c9d0",
    "title": "React useEffect 基础用法",
    "language": "javascript",
    "tags": ["react", "hooks"],
    "description": "useEffect 的基本使用模式",
    "code": "useEffect(() => {\n  // 副作用逻辑\n  return () => {\n    // 清理逻辑\n  };\n}, [deps]);",
    "createdAt": "2024-01-15T08:30:00.000Z",
    "updatedAt": "2024-01-15T08:30:00.000Z"
  },
  "message": "获取成功"
}
```

**错误响应（404）：**

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "代码片段不存在"
  }
}
```

---

### 3.4 创建代码片段

```
POST /api/snippets
```

**请求体：**

| 字段 | 类型 | 必填 | 约束 | 说明 |
|------|------|------|------|------|
| title | string | 是 | 1-100字符 | 标题 |
| language | string | 是 | 枚举值 | 编程语言 |
| tags | string[] | 否 | 每项1-20字符 | 标签数组 |
| description | string | 否 | 0-500字符 | 描述 |
| code | string | 是 | 1-10000字符 | 代码内容 |

**请求示例：**

```bash
curl -X POST "http://localhost:3000/api/snippets" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React useEffect 基础用法",
    "language": "javascript",
    "tags": ["react", "hooks"],
    "description": "useEffect 的基本使用模式",
    "code": "useEffect(() => {\n  // 副作用逻辑\n  return () => {\n    // 清理逻辑\n  };\n}, [deps]);"
  }'
```

**成功响应（201）：**

```json
{
  "success": true,
  "data": {
    "id": "6598a1b2c3d4e5f6a7b8c9d0",
    "title": "React useEffect 基础用法",
    "language": "javascript",
    "tags": ["react", "hooks"],
    "description": "useEffect 的基本使用模式",
    "code": "useEffect(() => {\n  // 副作用逻辑\n  return () => {\n    // 清理逻辑\n  };\n}, [deps]);",
    "createdAt": "2024-01-15T08:30:00.000Z",
    "updatedAt": "2024-01-15T08:30:00.000Z"
  },
  "message": "创建成功"
}
```

**校验失败响应（400）：**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数校验失败",
    "details": [
      {
        "field": "title",
        "message": "标题不能为空"
      },
      {
        "field": "language",
        "message": "不支持的语言类型"
      }
    ]
  }
}
```

---

### 3.5 更新代码片段

```
PATCH /api/snippets/:id
```

**Path 参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | MongoDB ObjectId |

**请求体：**

与创建相同，所有字段可选，仅更新提供的字段。

**请求示例：**

```bash
curl -X PATCH "http://localhost:3000/api/snippets/6598a1b2c3d4e5f6a7b8c9d0" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "React useEffect 完整指南",
    "tags": ["react", "hooks", "async"]
  }'
```

**成功响应（200）：**

```json
{
  "success": true,
  "data": {
    "id": "6598a1b2c3d4e5f6a7b8c9d0",
    "title": "React useEffect 完整指南",
    "language": "javascript",
    "tags": ["react", "hooks", "async"],
    "description": "useEffect 的基本使用模式",
    "code": "useEffect(() => {\n  // 副作用逻辑\n  return () => {\n    // 清理逻辑\n  };\n}, [deps]);",
    "createdAt": "2024-01-15T08:30:00.000Z",
    "updatedAt": "2024-01-15T09:15:00.000Z"
  },
  "message": "更新成功"
}
```

**错误响应（404）：**

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "代码片段不存在"
  }
}
```

---

### 3.6 删除代码片段

```
DELETE /api/snippets/:id
```

**Path 参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | MongoDB ObjectId |

**请求示例：**

```bash
curl -X DELETE "http://localhost:3000/api/snippets/6598a1b2c3d4e5f6a7b8c9d0"
```

**成功响应（204）：**

无响应体。

**错误响应（404）：**

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "代码片段不存在"
  }
}
```

---

## 4. 错误码定义

| 错误码 | HTTP状态码 | 说明 | 前端处理建议 |
|--------|-----------|------|-------------|
| VALIDATION_ERROR | 400 | 请求参数校验失败 | 高亮显示表单错误字段 |
| INVALID_LANGUAGE | 400 | 不支持的编程语言 | 提示用户选择有效语言 |
| NOT_FOUND | 404 | 资源不存在 | 显示404页面或提示 |
| INTERNAL_ERROR | 500 | 服务器内部错误 | 显示"服务暂不可用，请稍后重试" |

---

## 5. 数据类型定义

### 5.1 Snippet

```typescript
interface Snippet {
  id: string;                    // MongoDB ObjectId
  title: string;                 // 1-100字符
  language: string;              // 支持的编程语言
  tags: string[];                // 每项1-20字符
  description: string;           // 0-500字符
  code: string;                  // 1-10000字符
  createdAt: string;             // ISO 8601格式
  updatedAt: string;             // ISO 8601格式
}
```

### 5.2 CreateSnippetDto

```typescript
interface CreateSnippetDto {
  title: string;
  language: string;
  tags?: string[];
  description?: string;
  code: string;
}
```

### 5.3 UpdateSnippetDto

```typescript
interface UpdateSnippetDto {
  title?: string;
  language?: string;
  tags?: string[];
  description?: string;
  code?: string;
}
```

---

## 6. 前端 API 服务封装

```typescript
// services/snippetApi.ts
import axios from 'axios';
import { Snippet, CreateSnippetDto, UpdateSnippetDto } from '../types/snippet';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器 - 统一错误处理
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error?.message || '网络请求失败';
    return Promise.reject(new Error(message));
  }
);

export const snippetApi = {
  getAll: (params?: { language?: string; tags?: string }) =>
    api.get<Snippet[]>('/snippets', { params }),

  search: (keyword: string) =>
    api.get<Snippet[]>('/snippets/search', { params: { keyword } }),

  getById: (id: string) =>
    api.get<Snippet>(`/snippets/${id}`),

  create: (data: CreateSnippetDto) =>
    api.post<Snippet>('/snippets', data),

  update: (id: string, data: UpdateSnippetDto) =>
    api.patch<Snippet>(`/snippets/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/snippets/${id}`),
};
```
