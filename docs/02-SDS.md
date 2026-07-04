# 软件设计说明书（SDS）

## 1. 技术栈

### 1.1 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | ^18.2.0 | UI框架 |
| Vite | ^5.0.0 | 构建工具 |
| TypeScript | ^5.3.0 | 类型系统 |
| React Router | ^6.20.0 | 客户端路由 |
| CSS Modules | 内置 | 样式隔离 |
| PrismJS | ^1.29.0 | 代码语法高亮 |
| Lucide React | ^0.300.0 | 图标库 |
| Axios | ^1.6.0 | HTTP客户端 |
| clsx | ^2.1.0 | 类名合并工具 |

**说明：** 不引入任何第三方UI组件库（如Ant Design、Material UI）。所有UI组件完全自研，确保Apple风格的视觉一致性和极致定制能力。

### 1.2 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| NestJS | ^10.0.0 | Node.js服务端框架 |
| TypeScript | ^5.3.0 | 类型系统 |
| Mongoose | ^8.0.0 | MongoDB ODM |
| class-validator | ^0.14.0 | DTO参数验证 |

### 1.3 基础设施

| 技术 | 版本 | 用途 |
|------|------|------|
| MongoDB | 7.0 | 文档数据库 |
| Docker | 24.x | 容器化 |
| Docker Compose | 2.x | 多容器编排 |

---

## 2. 系统分层

采用经典的分层架构，前后端分离。

### 2.1 前端分层

```
┌──────────────────────────────────────────┐
│  Presentation Layer（表现层）             │
│  - Pages（页面）                          │
│  - Components（组件）                     │
│  - Hooks（自定义Hooks）                   │
├──────────────────────────────────────────┤
│  Application Layer（应用层）              │
│  - Services（API服务封装）                │
│  - Stores（状态管理）                     │
├──────────────────────────────────────────┤
│  Domain Layer（领域层）                   │
│  - Types（类型定义）                      │
│  - Constants（常量）                      │
│  - Utils（工具函数）                      │
└──────────────────────────────────────────┘
```

### 2.2 后端分层（NestJS标准分层）

```
┌──────────────────────────────────────────┐
│  Controller Layer（控制器层）             │
│  - 接收HTTP请求，调用Service，返回响应    │
├──────────────────────────────────────────┤
│  Service Layer（服务层）                  │
│  - 业务逻辑处理                           │
├──────────────────────────────────────────┤
│  Repository Layer（数据访问层）           │
│  - Mongoose Model操作                     │
├──────────────────────────────────────────┤
│  Domain Layer（领域层）                   │
│  - DTOs、Entities、Interfaces             │
└──────────────────────────────────────────┘
```

---

## 3. 数据模型

### 3.1 Snippet（代码片段）

```typescript
interface Snippet {
  id: string;           // MongoDB ObjectId
  title: string;        // 标题，必填，1-100字符
  language: string;     // 编程语言，必填
  tags: string[];       // 标签数组，可选，每项1-20字符
  description: string;  // 描述，可选，0-500字符
  code: string;         // 代码内容，必填，最大10000字符
  createdAt: Date;      // 创建时间
  updatedAt: Date;      // 最后更新时间
}
```

### 3.2 支持的编程语言列表

```typescript
const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'go',
  'rust',
  'css',
  'html',
  'shell',
  'sql',
  'json',
  'yaml',
  'markdown',
  'c',
  'cpp',
] as const;
```

---

## 4. 前端设计系统

### 4.1 自研组件清单

| 组件名 | 用途 | 复杂度 |
|--------|------|--------|
| `Button` | 按钮，多种变体 | 低 |
| `Input` | 文本输入框 | 低 |
| `TextArea` | 多行文本输入 | 低 |
| `Select` | 下拉选择器 | 中 |
| `Tag` | 标签展示/输入 | 中 |
| `TagInput` | 标签多选输入 | 中 |
| `Card` | 代码片段卡片 | 中 |
| `Modal` | 模态对话框 | 中 |
| `SlideOver` | 侧边滑出面板 | 中 |
| `SearchBar` | 搜索输入框 | 低 |
| `CodeBlock` | 代码展示块（含复制） | 中 |
| `CodeEditor` | 代码编辑器（带语法高亮） | 中 |
| `Toast` | 轻量提示 | 低 |
| `Alert` | 确认对话框 | 低 |
| `EmptyState` | 空状态展示 | 低 |
| `Skeleton` | 加载骨架屏 | 低 |
| `LanguageBadge` | 编程语言徽标 | 低 |

### 4.2 状态管理策略

采用 **React Context + useReducer** 进行全局状态管理。

**理由：**
- MVP功能简单，不需要Redux/Zustand等重型方案
- 数据以服务端状态为主（列表、搜索、筛选）
- 仅需管理：UI状态（模态框开关、当前筛选条件）

```
AppContext
├── snippets: Snippet[]          // 当前列表数据
├── searchQuery: string          // 搜索关键词
├── selectedTags: string[]       // 选中标签
├── selectedLanguage: string     // 选中语言
├── isModalOpen: boolean         // 模态框状态
├── currentSnippet: Snippet|null // 当前编辑/查看的片段
└── toast: ToastState            // Toast状态
```

### 4.3 路由设计

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | HomePage | 首页，列表+搜索+筛选 |
| `* ` | NotFoundPage | 404页面 |

**说明：** 创建/编辑/详情通过模态框/SlideOver在当前页完成，不跳转路由。

---

## 5. API通信设计

### 5.1 前端API服务层

```typescript
// services/snippetApi.ts
class SnippetApi {
  async getAll(): Promise<Snippet[]>;
  async getById(id: string): Promise<Snippet>;
  async create(data: CreateSnippetDto): Promise<Snippet>;
  async update(id: string, data: UpdateSnippetDto): Promise<Snippet>;
  async delete(id: string): Promise<void>;
  async search(keyword: string): Promise<Snippet[]>;
}
```

### 5.2 错误处理

```typescript
interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}
```

前端统一拦截HTTP错误，根据状态码显示对应的Toast提示：
- 400：显示服务端返回的具体错误信息
- 404：资源不存在
- 500：服务器内部错误，请稍后重试

---

## 6. 关键技术决策

### 6.1 为什么自研UI组件？

| 维度 | 自研组件 | Ant Design等第三方库 |
|------|---------|---------------------|
| 视觉控制 | 完全可控，100%实现Apple风格 | 受限于主题定制能力 |
| 包体积 | 仅包含所需组件，无冗余 | 包含大量未使用组件和样式 |
| 学习成本 | 一次编写，长期复用 | 需要学习组件库API |
| 开发成本 | MVP阶段组件数量可控（~15个） | 开箱即用，但定制困难 |
| 性能 | 无额外依赖，最优 | 有一定运行时开销 |

**结论：** MVP阶段组件数量可控（约15个基础组件），自研组件可以100%还原Apple设计风格，同时获得最优性能和最小包体积。

### 6.2 为什么使用CSS Modules而非CSS-in-JS？

- 零运行时开销
- 与Vite原生集成
- 样式隔离，无全局污染
- 足够表达Apple风格所需的全部样式能力

### 6.3 为什么使用Context而非Redux/Zustand？

- 应用状态简单，无复杂跨组件通信
- 减少依赖，降低包体积
- React官方推荐方案，无额外学习成本
