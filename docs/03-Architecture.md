# 系统架构设计

## 1. 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React + Vite + TypeScript + CSS Modules               │  │
│  │  - 自研UI组件库                                         │  │
│  │  - React Context 状态管理                               │  │
│  │  - localStorage 数据持久化                              │  │
│  └───────────────────────────────────────────────────────┘  │
│                        │                                    │
│                        ▼                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  localStorage                                          │  │
│  │  - code_snippet_user_id (用户标识)                      │  │
│  │  - code_snippet_vault (代码片段数据)                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 2. 技术架构特点

- **纯前端应用**：无后端服务，无数据库，所有数据存储在客户端
- **单页应用（SPA）**：React Router客户端路由，创建/编辑使用SlideOver不跳转
- **客户端存储**：localStorage持久化数据，每个用户数据独立隔离
- **用户标识**：首次访问自动生成唯一userId，存储在localStorage中

## 3. 项目目录结构

```
code-snippet-vault/
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
│       │   ├── formatDate.ts          # 日期格式化
│       │   └── debounce.ts            # 防抖函数
│       ├── services/
│       │   └── storageService.ts      # localStorage存储服务
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
│           └── snippet/               # 业务组件
│               ├── SnippetCard/
│               ├── SnippetForm/
│               ├── SnippetList/
│               ├── FilterBar/
│               └── LanguageBadge/
```

## 4. 核心模块说明

### 4.1 存储服务层（StorageService）

位于 `src/services/storageService.ts`，封装 localStorage 操作：

- `getUserId()` - 获取或生成用户唯一标识
- `getSnippets()` - 获取所有代码片段（含初始化示例数据）
- `saveSnippets()` - 保存代码片段数组
- `createSnippet()` - 创建新代码片段
- `updateSnippet()` - 更新代码片段
- `deleteSnippet()` - 删除代码片段
- `searchSnippets()` - 关键词搜索
- `filterSnippets()` - 按语言和标签筛选

### 4.2 状态管理（AppContext）

位于 `src/context/AppContext.tsx`，管理全局应用状态：

- snippets - 当前显示的代码片段列表
- searchQuery - 搜索关键词
- selectedTags - 选中的标签筛选条件
- selectedLanguage - 选中的语言筛选条件
- slideOver状态 - 侧边栏面板状态
- toast状态 - 消息提示状态
- alert状态 - 确认对话框状态

### 4.3 自定义Hooks

| Hook | 功能 |
|------|------|
| useSnippets | 获取片段列表和加载状态 |
| useSearch | 防抖搜索功能 |
| useClipboard | 剪贴板复制功能 |

## 5. 数据流向

```
用户操作 → AppContext dispatch → 状态更新 → UI渲染
         ↓
StorageService 读写 localStorage
         ↓
数据持久化存储
```

## 6. 首次访问流程

```
用户首次访问
    ↓
检查 localStorage 中是否存在 userId
    ↓
否 → 生成唯一 userId → 存储到 localStorage
是 → 读取已有 userId
    ↓
检查 localStorage 中是否存在 snippets
    ↓
否 → 初始化示例数据 → 存储到 localStorage
是 → 读取已有数据
    ↓
渲染应用界面
```