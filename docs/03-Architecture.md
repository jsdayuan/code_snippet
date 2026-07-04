# 系统架构设计

## 1. 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React + Vite + TypeScript + CSS Modules               │  │
│  │  - 自研UI组件库                                         │  │
│  │  - React Context 状态管理                               │  │
│  │  - PrismJS 语法高亮                                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                        │ HTTP/JSON                          │
├────────────────────────┼────────────────────────────────────┤
│                        ▼                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  NestJS + TypeScript                                   │  │
│  │  - Controller (REST API)                               │  │
│  │  - Service (Business Logic)                            │  │
│  │  - Repository (Mongoose)                               │  │
│  └───────────────────────────────────────────────────────┘  │
│                        │ Mongoose Driver                    │
├────────────────────────┼────────────────────────────────────┤
│                        ▼                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  MongoDB 7.0                                           │  │
│  │  - snippets collection                                 │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 2. 技术架构特点

- **前后端分离**：前端独立部署，通过RESTful API通信
- **单页应用（SPA）**：React Router客户端路由，创建/编辑使用SlideOver不跳转
- **无状态服务端**：NestJS不保存会话状态，便于水平扩展
- **文档数据库**：MongoDB存储灵活的Snippet结构

## 3. 项目目录结构

```
code-snippet-vault/
├── docker-compose.yml
├── README.md
├── frontend/                          # 前端项目
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── main.tsx                   # 应用入口
│       ├── App.tsx                    # 根组件
│       ├── index.css                  # 全局样式、CSS变量
│       ├── types/
│       │   └── snippet.ts             # Snippet类型定义
│       ├── constants/
│       │   ├── languages.ts           # 支持的语言列表
│       │   └── theme.ts               # 设计系统常量（颜色、间距等）
│       ├── utils/
│       │   ├── api.ts                 # Axios实例配置
│       │   ├── formatDate.ts          # 日期格式化
│       │   └── debounce.ts            # 防抖函数
│       ├── services/
│       │   └── snippetApi.ts          # Snippet API封装
│       ├── context/
│       │   └── AppContext.tsx         # 全局状态Context
│       ├── hooks/
│       │   ├── useSnippets.ts         # 片段列表逻辑
│       │   ├── useSearch.ts           # 搜索逻辑
│       │   └── useClipboard.ts        # 剪贴板复制
│       ├── pages/
│       │   ├── HomePage/
│       │   │   ├── HomePage.tsx
│       │   │   └── HomePage.module.css
│       │   └── NotFoundPage/
│       │       ├── NotFoundPage.tsx
│       │       └── NotFoundPage.module.css
│       └── components/
│           ├── ui/                    # 基础UI组件（自研）
│           │   ├── Button/
│           │   │   ├── Button.tsx
│           │   │   └── Button.module.css
│           │   ├── Input/
│           │   ├── TextArea/
│           │   ├── Select/
│           │   ├── Tag/
│           │   ├── Card/
│           │   ├── Modal/
│           │   ├── SlideOver/
│           │   ├── Toast/
│           │   ├── Alert/
│           │   ├── Skeleton/
│           │   └── EmptyState/
│           ├── layout/                # 布局组件
│           │   ├── Header/
│           │   └── Footer/
│           ├── snippet/               # 业务组件
│           │   ├── SnippetCard/
│           │   ├── SnippetForm/
│           │   ├── SnippetDetail/
│           │   ├── SnippetList/
│           │   ├── FilterBar/
│           │   ├── CodeBlock/
│           │   ├── CodeEditor/
│           │   ├── LanguageBadge/
│           │   └── TagInput/
│           └── icons/                 # 图标组件（Lucide封装）
│
├── backend/                           # 后端项目
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── Dockerfile
│   └── src/
│       ├── main.ts                    # 应用入口
│       ├── app.module.ts              # 根模块
│       ├── config/
│       │   └── database.config.ts     # 数据库配置
│       ├── common/                    # 公共模块
│       │   ├── filters/
│       │   │   └── http-exception.filter.ts
│       │   ├── interceptors/
│       │   │   └── transform.interceptor.ts
│       │   └── dto/
│       │       └── api-response.dto.ts
│       └── snippets/                  # Snippet模块
│           ├── snippets.module.ts
│           ├── snippets.controller.ts
│           ├── snippets.service.ts
│           ├── snippets.repository.ts
│           ├── dto/
│           │   ├── create-snippet.dto.ts
│           │   └── update-snippet.dto.ts
│           ├── entities/
│           │   └── snippet.entity.ts
│           └── schemas/
│               └── snippet.schema.ts
│
└── docs/                              # 项目文档
    ├── 01-SRS.md
    ├── 02-SDS.md
    ├── 03-Architecture.md
    ├── 04-API.md
    ├── 05-Database.md
    ├── 06-Code-Convention.md
    ├── 07-Development-Plan.md
    ├── 08-Deployment.md
    ├── 09-AI-Development-Rules.md
    └── 10-UI-UX-Design.md
```

## 4. 模块依赖关系

### 4.1 前端模块依赖

```
App.tsx
├── AppContext (全局状态)
│   ├── searchQuery, selectedTags, selectedLanguage
│   ├── snippets (列表数据)
│   ├── isSlideOverOpen, currentSnippet
│   └── toast
│
├── HomePage
│   ├── Header
│   │   ├── Logo
│   │   ├── SearchBar ──→ useSearch (防抖300ms)
│   │   └── Button (新建)
│   ├── FilterBar
│   │   ├── Tag[] (标签筛选)
│   │   └── Select (语言筛选)
│   └── SnippetList
│       ├── SnippetCard[] ──→ Card + LanguageBadge + Tag[]
│       ├── EmptyState (无数据)
│       └── Skeleton[] (加载中)
│
├── SlideOver (创建/编辑/详情)
│   ├── SnippetForm (创建/编辑模式)
│   │   ├── Input (标题)
│   │   ├── Select (语言)
│   │   ├── TagInput (标签)
│   │   ├── TextArea (描述)
│   │   ├── CodeEditor (代码) ──→ PrismJS
│   │   └── Button[] (保存/取消)
│   └── SnippetDetail (查看模式)
│       ├── LanguageBadge
│       ├── Tag[]
│       ├── Text (描述)
│       ├── CodeBlock (代码) ──→ PrismJS + CopyButton
│       └── Button[] (编辑/删除)
│
├── Toast (全局提示)
└── Alert (确认对话框)
```

### 4.2 后端模块依赖

```
AppModule
├── ConfigModule (环境变量)
├── MongooseModule (数据库连接)
└── SnippetsModule
    ├── SnippetsController (/api/snippets)
    │   ├── GET / (getAll, 支持query过滤)
    │   ├── GET /:id (getById)
    │   ├── POST / (create)
    │   ├── PATCH /:id (update)
    │   ├── DELETE /:id (delete)
    │   └── GET /search (search)
    ├── SnippetsService
    │   ├── findAll(filter)
    │   ├── findOne(id)
    │   ├── create(dto)
    │   ├── update(id, dto)
    │   ├── remove(id)
    │   └── search(keyword)
    └── SnippetsRepository (MongooseModel封装)
        └── SnippetModel (MongoDB Collection)
```

## 5. 数据流

### 5.1 列表加载流程

```
[HomePage Mount]
    ↓
[useSnippets Hook] ──→ [GET /api/snippets]
    ↓                           ↓
[AppContext: snippets] ←── [SnippetsController]
    ↓                           ↓
[SnippetList渲染] ←────── [SnippetsService]
                                ↓
                          [SnippetsRepository]
                                ↓
                          [MongoDB: snippets]
```

### 5.2 创建流程

```
[点击"新建"]
    ↓
[AppContext: isSlideOverOpen = true]
    ↓
[SlideOver打开动画(350ms)]
    ↓
[填写表单] ──→ [实时验证(class-validator)]
    ↓
[点击保存]
    ↓
[POST /api/snippets] ──→ [创建成功]
    ↓                           ↓
[AppContext更新列表] ←──── [返回新Snippet]
    ↓
[SlideOver关闭 + Toast提示]
    ↓
[新卡片顶部stagger淡入]
```

### 5.3 搜索流程

```
[输入关键词]
    ↓
[300ms 防抖]
    ↓
[GET /api/snippets/search?keyword=xxx]
    ↓
[AppContext更新snippets]
    ↓
[SnippetList重新渲染(stagger动画)]
```

## 6. 部署架构

```
┌──────────────────────────────────────────┐
│           Docker Compose网络              │
│                                          │
│  ┌──────────────┐    ┌──────────────┐   │
│  │  frontend    │    │  backend     │   │
│  │  (Nginx)     │    │  (NestJS)    │   │
│  │  Port: 80    │    │  Port: 3000  │   │
│  └──────────────┘    └──────┬───────┘   │
│                             │            │
│                      ┌──────┴───────┐    │
│                      │  mongodb     │    │
│                      │  Port: 27017 │    │
│                      └──────────────┘    │
└──────────────────────────────────────────┘
```

### 6.1 容器说明

| 容器 | 镜像 | 端口 | 作用 |
|------|------|------|------|
| frontend | nginx:alpine | 80 | 静态资源托管，API请求代理到backend |
| backend | node:20-alpine | 3000 | NestJS应用服务 |
| mongodb | mongo:7 | 27017 | 文档数据库 |

### 6.2 网络通信

- frontend → backend：Docker内部网络，通过服务名`backend:3000`通信
- backend → mongodb：Docker内部网络，通过服务名`mongodb:27017`通信
- 外部 → frontend：通过宿主机的80端口访问
