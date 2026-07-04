# 代码规范

## 1. 命名规范

### 1.1 文件与文件夹

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件夹 | kebab-case | `snippet-card/`, `filter-bar/` |
| 组件文件 | PascalCase | `Button.tsx`, `SlideOver.tsx` |
| 样式文件 | PascalCase + `.module.css` | `Button.module.css` |
| 工具文件 | camelCase | `formatDate.ts`, `debounce.ts` |
| 常量文件 | camelCase | `languages.ts`, `theme.ts` |
| 类型文件 | camelCase | `snippet.ts` |

### 1.2 TypeScript 命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `Button`, `SnippetCard` |
| 接口 | PascalCase | `Snippet`, `CreateSnippetDto` |
| 类型别名 | PascalCase | `ToastType`, `ButtonVariant` |
| 枚举 | PascalCase + 大写下划线成员 | `Language.JAVASCRIPT` |
| 变量/函数 | camelCase | `getSnippets`, `isModalOpen` |
| 常量 | 全大写下划线 | `MAX_TITLE_LENGTH`, `SUPPORTED_LANGUAGES` |
| 自定义Hook | use + PascalCase | `useSnippets`, `useClipboard` |
| CSS类名 | camelCase | `.buttonPrimary`, `.cardHover` |

### 1.3 后端命名（NestJS）

| 类型 | 规范 | 示例 |
|------|------|------|
| 类 | PascalCase | `SnippetsController`, `CreateSnippetDto` |
| 方法 | camelCase | `findAll()`, `createSnippet()` |
| 私有方法/属性 | 下划线前缀 | `_formatResponse()` |

## 2. Git 提交规范

### 2.1 Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 2.2 Type 类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(snippets): 添加代码片段搜索功能` |
| `fix` | 修复bug | `fix(ui): 修复卡片hover动画闪烁` |
| `refactor` | 重构 | `refactor(api): 统一错误响应格式` |
| `docs` | 文档 | `docs(readme): 更新部署说明` |
| `style` | 代码格式 | `style(components): 统一缩进` |
| `test` | 测试 | `test(snippets): 添加service单元测试` |
| `chore` | 构建/工具 | `chore(deps): 升级react至18.3` |
| `perf` | 性能优化 | `perf(list): 优化大列表渲染` |

### 2.3 提交示例

```
feat(ui): 新增 SlideOver 组件

- 实现从右侧滑入的动画面板
- 支持创建/编辑/详情三种模式
- 添加毛玻璃背景遮罩效果

Closes #12
```

## 3. 代码原则

### 3.1 通用原则

- **单一职责**：每个函数/组件只做一件事
- **DRY**：不要重复自己，提取公共逻辑到utils/hooks
- **KISS**：保持简单，避免过度设计
- **显式优于隐式**：类型标注完整，不依赖推断

### 3.2 TypeScript 严格规范

```json
// tsconfig.json 必须开启
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**禁止：**
- 使用 `any` 类型（特殊情况需注释说明）
- 使用 `@ts-ignore`（必须使用 `@ts-expect-error` 并说明原因）
- 非空断言 `!` 的滥用

### 3.3 组件编写规范

```typescript
// ✅ 正确示例
import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'text' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
}) => {
  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
```

### 3.4 CSS Modules 规范

```css
/* Button.module.css */

/* 基础类名 */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease-out;
}

/* 变体 */
.primary {
  background-color: var(--color-brand);
  color: white;
}

.primary:hover {
  background-color: var(--color-brand-hover);
  transform: scale(1.02);
}

/* 尺寸 */
.sm {
  padding: 6px 12px;
  font-size: 12px;
}

.md {
  padding: 10px 20px;
  font-size: 14px;
}
```

**CSS 原则：**
- 使用 CSS 变量管理设计系统（定义在 `index.css`）
- 所有过渡动画统一使用 `ease-out` 缓动
- 避免使用 `!important`
- 颜色值统一引用变量，不直接写死

### 3.5 全局 CSS 变量

```css
/* frontend/src/index.css */

:root {
  /* 品牌色 */
  --color-brand: #0071e3;
  --color-brand-hover: #0077ed;
  --color-brand-light: rgba(0, 113, 227, 0.15);

  /* 中性色 */
  --color-background: #ffffff;
  --color-surface: #f5f5f7;
  --color-surface-hover: #ebebf0;
  --color-border: #d2d2d7;
  --color-text-primary: #1d1d1f;
  --color-text-secondary: #86868b;
  --color-text-tertiary: #b0b0b5;

  /* 语义色 */
  --color-success: #34c759;
  --color-error: #ff3b30;
  --color-warning: #ff9500;

  /* 阴影 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.16);

  /* 圆角 */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* 间距 */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* 字体 */
  --font-sans: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'SF Mono', SFMono-Regular, 'Fira Code', Consolas,
    'Liberation Mono', Menlo, Courier, monospace;

  /* 过渡 */
  --transition-fast: 150ms ease-out;
  --transition-normal: 250ms ease-out;
  --transition-slow: 350ms ease-out;
}
```

## 4. 代码审查清单

### 4.1 提交前自检

- [ ] 代码能正常编译，无 TypeScript 错误
- [ ] 所有新增代码都有适当的类型标注
- [ ] 没有使用 `any` 类型
- [ ] CSS 变量使用规范，无硬编码颜色值
- [ ] 组件 props 都有接口定义
- [ ] 动效时长和缓动函数符合设计规范
- [ ] 响应式布局已测试（桌面/平板/手机）

### 4.2 PR 审查要点

- [ ] 代码是否符合命名规范
- [ ] 是否有重复代码需要提取
- [ ] 错误处理是否完善
- [ ] 性能是否有明显问题（如不必要的重渲染）
- [ ] 可访问性（a11y）是否考虑（键盘操作、ARIA标签）
- [ ] 移动端交互是否友好

## 5. 工具配置

### 5.1 ESLint 配置

```json
// frontend/.eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'react-refresh/only-export-components': 'warn',
  },
};
```

### 5.2 Prettier 配置

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### 5.3 VS Code 推荐配置

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```
