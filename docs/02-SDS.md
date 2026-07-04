# 软件设计说明书（SDS）

## 1. 技术栈

### 1.1 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | ^18.2.0 | UI框架 |
| Vite | ^5.0.0 | 构建工具 |
| TypeScript | ^5.3.0 | 类型系统 |
| React Router | ^7.0.0 | 客户端路由 |
| CSS Modules | 内置 | 样式隔离 |
| Lucide React | ^1.23.0 | 图标库 |
| clsx | ^2.1.0 | 类名合并工具 |

**说明：** 不引入任何第三方UI组件库（如Ant Design、Material UI）。所有UI组件完全自研，确保Apple风格的视觉一致性和极致定制能力。

### 1.2 数据存储

| 存储方式 | 用途 |
|---------|------|
| localStorage | 客户端数据持久化存储 |
| Session Storage | 临时会话数据 |

---

## 2. 系统分层

采用纯前端分层架构，数据存储在客户端 localStorage 中。

### 2.1 前端分层

```
┌──────────────────────────────────────────┐
│  Presentation Layer（表现层）             │
│  - Pages（页面）                          │
│  - Components（组件）                     │
│  - Hooks（自定义Hooks）                   │
├──────────────────────────────────────────┤
│  Application Layer（应用层）              │
│  - Services（存储服务）                   │
│  - Context（状态管理）                    │
├──────────────────────────────────────────┤
│  Domain Layer（领域层）                   │
│  - Types（类型定义）                      │
│  - Constants（常量）                      │
│  - Utils（工具函数）                      │
└──────────────────────────────────────────┘
```

---

## 3. 数据模型

### 3.1 Snippet（代码片段）

```typescript
interface Snippet {
  id: string;           // 唯一标识，自动生成
  title: string;        // 标题，必填，1-100字符
  language: string;     // 编程语言，必填
  tags: string[];       // 标签数组，可选，每项1-20字符
  description: string;  // 描述，可选，0-500字符
  code: string;         // 代码内容，必填，最大10000字符
  createdAt: string;    // 创建时间（ISO字符串）
  updatedAt: string;    // 最后更新时间（ISO字符串）
}
```

### 3.2 用户标识

```typescript
interface UserInfo {
  userId: string;       // 用户唯一标识，首次访问时生成
}
```

---

## 4. 存储策略

### 4.1 用户标识生成

- 用户首次访问时，生成唯一的 userId（基于时间戳和随机数）
- userId 存储在 localStorage 的 `code_snippet_user_id` 键中
- 后续访问时自动读取，保持数据隔离

### 4.2 数据存储

- 所有代码片段数据存储在 localStorage 的 `code_snippet_vault` 键中
- 数据格式为 JSON 数组
- 首次访问时自动初始化示例数据（seed data）

### 4.3 存储限制

- localStorage 容量限制约 5MB
- 建议单条代码片段不超过 10000 字符
- 总数据量超过限制时，提示用户清理历史数据

---

## 5. 项目结构

```
frontend/
├── src/
│   ├── components/          # UI组件
│   │   ├── ui/              # 通用UI组件
│   │   ├── layout/         # 布局组件
│   │   └── snippet/        # 业务组件
│   ├── context/            # 全局状态管理
│   ├── hooks/              # 自定义Hooks
│   ├── services/           # 存储服务
│   ├── types/              # TypeScript类型定义
│   ├── constants/          # 常量定义
│   ├── utils/              # 工具函数
│   ├── pages/              # 页面组件
│   └── App.tsx             # 主应用组件
├── public/                 # 静态资源
├── index.html              # HTML入口
├── vite.config.ts          # Vite配置
├── tsconfig.json           # TypeScript配置
└── package.json            # 依赖配置
```