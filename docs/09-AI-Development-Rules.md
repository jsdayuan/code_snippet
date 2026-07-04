# AI 辅助开发规则

## 1. 核心原则

1. **优先生成可运行代码** — 每段代码都应能直接放入项目并正常工作
2. **最小变更原则** — 每次修改只改变必要的部分，不引入无关改动
3. **保持RESTful** — 所有API遵循REST设计规范
4. **不重复代码** — 公共逻辑提取到utils、hooks或services
5. **添加必要注释** — 复杂逻辑必须有注释说明"为什么"
6. **保持TypeScript严格模式** — 绝不使用`any`，类型标注完整

## 2. 开发前准备

每次开始新功能开发前，AI必须：

1. **阅读相关文档**
   - `02-SDS.md` — 确认技术栈和设计决策
   - `10-UI-UX-Design.md` — 确认组件设计规范
   - `04-API.md` — 确认接口契约
   - `06-Code-Convention.md` — 确认命名和代码规范

2. **确认当前项目状态**
   - 检查已有文件，不重复创建
   - 确认依赖是否已安装
   - 确认相关组件/接口是否已存在

## 3. 代码生成规范

### 3.1 组件开发顺序

开发新组件时，按以下顺序进行：

1. 定义 Props 接口（TypeScript）
2. 编写组件主体逻辑
3. 编写对应的 CSS Modules
4. 导出组件

### 3.2 自研组件要求

所有UI组件必须：

- 完全使用 CSS Modules，不引入任何第三方UI库
- 遵循 `10-UI-UX-Design.md` 中的设计规范（颜色、间距、圆角、阴影、动效）
- 使用 CSS Variables（`var(--color-brand)`）而非硬编码值
- 支持必要的 accessibility 属性（`aria-label`, `role` 等）
- 动效时长和缓动函数严格按规范执行

### 3.3 API 开发要求

后端代码必须：

- Controller 只负责接收请求和返回响应，不处理业务逻辑
- Service 处理业务逻辑，不直接操作数据库
- 使用 DTO 进行参数校验（class-validator）
- 统一返回格式（`{ success, data, message }`）
- 全局异常过滤器捕获所有错误，不暴露敏感信息

### 3.4 禁止事项

- [ ] 禁止使用 `any` 类型
- [ ] 禁止使用 `@ts-ignore`
- [ ] 禁止在组件中直接调用 fetch/axios（必须通过services层）
- [ ] 禁止内联样式（`style={{ }}`），特殊情况需注释说明
- [ ] 禁止魔法数字，使用常量替代
- [ ] 禁止在循环中使用 `index` 作为 `key`
- [ ] 禁止直接修改 state（必须返回新对象/数组）

## 4. 动效实现规范

所有动效代码必须精确符合设计规范：

```css
/* ✅ 正确：使用CSS变量和精确值 */
.card {
  transition: transform var(--transition-normal),
    box-shadow var(--transition-normal);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

/* ❌ 错误：随意写数值 */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
```

关键动效参数速查：

| 动效类型 | 时长 | 缓动函数 | transform |
|---------|------|----------|-----------|
| Hover提升 | 250ms | ease-out | translateY(-4px) |
| 按钮缩放 | 150ms | ease-out | scale(1.02) |
| 按钮按压 | 100ms | ease-out | scale(0.98) |
| 面板展开 | 350ms | cubic-bezier(0.34,1.56,0.64,1) | translateX(0) |
| Toast出现 | 300ms | cubic-bezier(0.34,1.56,0.64,1) | translateY(0) |
| 列表淡入 | 300ms | ease-out | translateY(0) + opacity:1 |
| stagger间隔 | 50ms | - | - |

## 5. 代码审查清单（AI自检）

每完成一个功能模块，AI必须按以下清单自检：

### 5.1 功能检查

- [ ] 能正常启动（`npm run dev` / `npm run start:dev`）
- [ ] 能正常编译（`npm run build`）无TypeScript错误
- [ ] CRUD功能完整可用
- [ ] 搜索功能正常（含防抖）
- [ ] 筛选功能正常（标签+语言）
- [ ] 一键复制功能正常

### 5.2 代码质量检查

- [ ] 无 `any` 类型
- [ ] 所有函数有返回类型标注
- [ ] 所有组件props有接口定义
- [ ] 无未使用的变量/导入
- [ ] 无console.log（开发调试除外）
- [ ] 错误处理完善（try-catch + Toast提示）

### 5.3 UI检查

- [ ] 颜色使用CSS变量
- [ ] 圆角符合规范（6/8/12/16/9999px）
- [ ] 阴影符合规范（4层阴影系统）
- [ ] 动效时长和缓动正确
- [ ] 响应式布局正常（桌面3列/平板2列/手机1列）
- [ ] 空状态和加载状态已处理

### 5.4 性能检查

- [ ] 列表使用key属性
- [ ] 避免不必要的重渲染（React.memo适当使用）
- [ ] 搜索防抖已实现（300ms）
- [ ] 图片/代码高亮按需加载

## 6. 常见错误预防

### 6.1 React 相关

```typescript
// ❌ 错误：直接修改数组
snippets.push(newSnippet);
setSnippets(snippets);

// ✅ 正确：返回新数组
setSnippets([newSnippet, ...snippets]);

// ❌ 错误：在渲染中执行副作用
const SearchBar = () => {
  const [query, setQuery] = useState('');
  // 错误：每次渲染都执行
  fetchResults(query);
};

// ✅ 正确：使用useEffect
useEffect(() => {
  fetchResults(query);
}, [query]);
```

### 6.2 CSS Modules 相关

```css
/* ❌ 错误：使用连接符 */
.card-header { }

/* ✅ 正确：使用camelCase */
.cardHeader { }
```

```typescript
// ❌ 错误：多个类名拼接易出错
className={styles.card + ' ' + styles.hover}

// ✅ 正确：使用模板字符串或clsx
className={`${styles.card} ${styles.hover}`}
// 或安装 clsx: className={clsx(styles.card, styles.hover)}
```

### 6.3 NestJS 相关

```typescript
// ❌ 错误：Controller中处理业务逻辑
@Controller('snippets')
export class SnippetsController {
  @Post()
  async create(@Body() dto: CreateSnippetDto) {
    // 错误：直接操作数据库
    const snippet = new this.snippetModel(dto);
    return snippet.save();
  }
}

// ✅ 正确：分层处理
@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Post()
  async create(@Body() dto: CreateSnippetDto) {
    return this.snippetsService.create(dto);
  }
}
```

## 7. 迭代开发建议

### 7.1 增量开发流程

```
1. 明确本次要实现的功能点
2. 确认涉及的文件和组件
3. 先写类型定义（TypeScript接口）
4. 再写核心逻辑
5. 最后完善样式和动效
6. 执行自检清单
7. 运行测试验证
```

### 7.2 回退策略

如果某次修改导致问题：

1. 使用 `git diff` 查看变更范围
2. 优先尝试修复而非回退
3. 如无法快速修复，使用 `git checkout` 恢复单个文件
4. 记录问题原因，避免重复犯错

## 8. 文档同步

代码变更后，AI应同步更新相关文档：

- 新增/修改API → 更新 `04-API.md`
- 新增/修改组件 → 更新 `10-UI-UX-Design.md` 组件列表
- 新增/修改数据库字段 → 更新 `05-Database.md`
- 技术栈变更 → 更新 `02-SDS.md`
