# Code Snippet Vault

一个简洁优雅的代码片段速查本，采用 Apple 风格设计，帮助开发者快速管理和查找代码片段。

## ✨ 特性

- **纯前端应用** - 无后端服务，所有数据存储在客户端 localStorage
- **用户隔离** - 首次访问自动生成唯一标识，数据独立存储
- **代码高亮** - 支持多种编程语言语法高亮
- **智能搜索** - 支持标题、描述、代码、标签的全文搜索
- **分类筛选** - 按语言和标签进行筛选
- **一键复制** - 快速复制代码到剪贴板
- **响应式设计** - 完美适配桌面端和移动端

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | ^18.2.0 | UI框架 |
| Vite | ^5.0.0 | 构建工具 |
| TypeScript | ^5.3.0 | 类型系统 |
| React Router | ^7.0.0 | 客户端路由 |
| CSS Modules | 内置 | 样式隔离 |
| Lucide React | ^1.23.0 | 图标库 |

## 📦 安装

```bash
cd frontend
npm install
```

## 🚀 运行

```bash
npm run dev
```

访问 http://localhost:5173

## 🔧 构建

```bash
npm run build
```

构建产物位于 `dist` 目录。

## 📁 项目结构

```
frontend/
├── src/
│   ├── components/          # UI组件
│   │   ├── ui/              # 通用UI组件（Button, Input, Card等）
│   │   ├── layout/         # 布局组件（Header, Footer）
│   │   └── snippet/        # 业务组件（SnippetCard, SnippetForm等）
│   ├── context/            # 全局状态管理（AppContext）
│   ├── hooks/              # 自定义Hooks（useSnippets, useSearch等）
│   ├── services/           # 存储服务（localStorage封装）
│   ├── types/              # TypeScript类型定义
│   ├── constants/          # 常量定义（语言、主题等）
│   ├── utils/              # 工具函数
│   └── pages/              # 页面组件
└── dist/                   # 构建产物
```

## 🚀 部署

### Vercel（最快部署）

```bash
npm install -g vercel
cd frontend
vercel
```

### GitHub Pages

```bash
npm install gh-pages --save-dev
npm run build
npm run deploy
```

### 自托管服务器

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/code-snippet-vault/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📝 支持的语言

- JavaScript
- TypeScript
- Python
- Java
- Go
- Rust
- Swift
- Kotlin
- PHP
- Ruby
- C++
- C#
- HTML
- CSS
- SQL
- JSON
- Markdown

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！