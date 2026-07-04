# UI/UX 设计规范

## 1. 设计理念

### 1.1 设计原则

本系统遵循 Apple 官网级设计品质，核心原则：

1. **极致简约**：每个元素都有其存在的理由，去除一切不必要的装饰
2. **内容为王**：代码片段是核心，UI 始终服务于内容展示
3. **精致细节**：圆角、阴影、过渡的精心调校，营造高级感
4. **直觉交互**：用户无需思考即可知道如何操作
5. **流畅动效**：每一次状态变化都是愉悦的视觉体验

### 1.2 设计关键词

`纯净` `通透` `轻盈` `精准` `从容`

---

## 2. 色彩系统

### 2.1 主色板

```
Brand Blue     #0071E3  →  主按钮、链接、选中状态
Brand Blue Hover #0077ED → 按钮hover状态
```

### 2.2 中性色板

```
Background      #FFFFFF  →  页面背景
Surface         #F5F5F7  →  卡片背景、输入框背景
Surface Hover   #EBEBF0  →  列表hover、按钮hover（次要）
Border          #D2D2D7  →  分割线、输入框边框
Text Primary    #1D1D1F  →  主标题、正文
Text Secondary  #86868B  →  次要文字、描述、placeholder
Text Tertiary   #B0B0B5  →  禁用状态、时间戳
```

### 2.3 语义色彩

```
Success  #34C759  →  操作成功、复制成功提示
Error    #FF3B30  →  错误提示、删除确认、验证失败
Warning  #FF9500  →  警告提示
Info     #0071E3  →  信息提示
```

### 2.4 语言色彩映射

每种编程语言对应一个独特的颜色标签，用于视觉区分：

| 语言 | 色值 | 背景（15%透明度） |
|------|------|----------------|
| JavaScript | #F7DF1E | rgba(247, 223, 30, 0.15) |
| TypeScript | #3178C6 | rgba(49, 120, 198, 0.15) |
| Python | #3776AB | rgba(55, 118, 171, 0.15) |
| Java | #007396 | rgba(0, 115, 150, 0.15) |
| Go | #00ADD8 | rgba(0, 173, 216, 0.15) |
| Rust | #DEA584 | rgba(222, 165, 132, 0.15) |
| CSS | #264DE4 | rgba(38, 77, 228, 0.15) |
| HTML | #E34F26 | rgba(227, 79, 38, 0.15) |
| Shell | #4EAA25 | rgba(78, 170, 37, 0.15) |
| SQL | #F29111 | rgba(242, 145, 17, 0.15) |
| 其他 | #86868B | rgba(134, 134, 139, 0.15) |

---

## 3. 字体排版

### 3.1 字体栈

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI",
  Roboto, "Helvetica Neue", Arial, sans-serif;
```

### 3.2 字体层级

| 层级 | 字号 | 字重 | 行高 | 字间距 | 用途 |
|------|------|------|------|--------|------|
| Display | 48px | 700 | 1.1 | -0.02em | 页面主标题（空状态） |
| H1 | 32px | 600 | 1.2 | -0.01em | 区域标题 |
| H2 | 24px | 600 | 1.3 | -0.01em | 卡片标题、模态框标题 |
| H3 | 18px | 600 | 1.4 | 0 | 小标题 |
| Body | 16px | 400 | 1.5 | 0 | 正文描述 |
| Body Small | 14px | 400 | 1.5 | 0 | 次要文字、标签 |
| Caption | 12px | 400 | 1.4 | 0.01em | 时间戳、辅助信息 |
| Code | 14px | 400 | 1.6 | 0 | 代码内容（等宽字体） |

### 3.3 等宽字体栈

```css
font-family: "SF Mono", SFMono-Regular, "Fira Code", "Consolas",
  "Liberation Mono", Menlo, Courier, monospace;
```

---

## 4. 间距系统

基于 4px 的基数单位：

| Token | 值 | 用途 |
|-------|-----|------|
| space-1 | 4px | 图标与文字间距 |
| space-2 | 8px | 紧凑内边距 |
| space-3 | 12px | 标签内边距 |
| space-4 | 16px | 标准内边距 |
| space-5 | 20px | 卡片内边距 |
| space-6 | 24px | 组件间距 |
| space-8 | 32px | 区域间距 |
| space-10 | 40px | 大区域间距 |
| space-12 | 48px | 页面边距（桌面） |
| space-16 | 64px | 大区块间距 |

---

## 5. 阴影系统

```css
/* 卡片默认 */
shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);

/* 卡片 Hover */
shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);

/* 模态框、下拉菜单 */
shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

/* 悬浮按钮 */
shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.16);
```

---

## 6. 圆角系统

| Token | 值 | 用途 |
|-------|-----|------|
| radius-sm | 6px | 标签、小按钮 |
| radius-md | 8px | 输入框、小卡片 |
| radius-lg | 12px | 卡片 |
| radius-xl | 16px | 大卡片、模态框 |
| radius-full | 9999px | Pill 形状（标签、筛选器） |

---

## 7. 动效设计

### 7.1 缓动函数

```css
/* 标准出场 */
ease-out: cubic-bezier(0.25, 0.1, 0.25, 1);

/* 弹性效果 */
ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* 平滑过渡 */
ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
```

### 7.2 过渡时长

| 类型 | 时长 | 用途 |
|------|------|------|
| Instant | 0ms | 颜色变化（无感知） |
| Fast | 150ms | hover状态、按钮反馈 |
| Normal | 250ms | 组件状态切换 |
| Slow | 350ms | 模态框、面板展开 |
| Page | 450ms | 页面级过渡 |

### 7.3 各组件动效规范

#### 卡片 Hover
```
触发：mouseenter
变化：
  - transform: translateY(0) → translateY(-4px)
  - box-shadow: shadow-sm → shadow-md
时长：250ms
缓动：ease-out
```

#### 按钮 Hover
```
触发：mouseenter
变化：
  - background: 加深5%
  - transform: scale(1) → scale(1.02)
时长：150ms
缓动：ease-out
```

#### 按钮 Active/Press
```
触发：mousedown
变化：
  - transform: scale(1.02) → scale(0.98)
时长：100ms
缓动：ease-out
```

#### 模态框/SlideOver 出现
```
触发：打开动作
背景遮罩：
  - opacity: 0 → 1
  - backdrop-filter: blur(0) → blur(8px)
面板：
  - 模态框：opacity 0→1, scale(0.95)→scale(1)
  - SlideOver：translateX(100%)→translateX(0)
时长：350ms
缓动：ease-spring（面板）, ease-smooth（遮罩）
```

#### 模态框/SlideOver 消失
```
时长：250ms（比出现快，符合用户急于离开的心理）
缓动：ease-smooth
```

#### Toast 出现
```
触发：操作完成
变化：
  - opacity: 0 → 1
  - transform: translateY(20px) → translateY(0)
时长：300ms
缓动：ease-spring
自动消失：3s后，opacity→0，translateY→(-20px)，时长250ms
```

#### 列表项进入（Stagger）
```
触发：页面加载或筛选变化
变化：每项依次淡入
  - opacity: 0 → 1
  - transform: translateY(20px) → translateY(0)
时长：每项300ms
间隔：50ms
缓动：ease-out
```

#### 输入框 Focus
```
触发：focus
变化：
  - border-color: Border → Brand Blue
  - box-shadow: 0 0 0 0 → 0 0 0 3px rgba(0, 113, 227, 0.15)
时长：150ms
缓动：ease-out
```

#### 复制按钮反馈
```
触发：点击复制
变化：
  - 图标：复制图标 → 对勾图标
  - 颜色：Text Secondary → Success
  - scale: 1 → 1.2 → 1（弹跳效果）
时长：200ms
缓动：ease-spring
恢复：2s后自动恢复原始图标
```

---

## 8. 组件设计规范

### 8.1 Button 按钮

**主按钮（Primary）**
```
背景：Brand Blue
文字：白色，14px，600字重
内边距：10px 20px
圆角：radius-full（Pill形状）
Hover：背景加深，scale(1.02)
Active：scale(0.98)
禁用：背景 #D2D2D7，文字 #86868B
```

**次要按钮（Secondary）**
```
背景：Surface
文字：Text Primary
边框：1px solid Border
Hover：背景 Surface Hover
```

**文字按钮（Text）**
```
背景：透明
文字：Brand Blue
Hover：背景 rgba(0, 113, 227, 0.08)
```

**危险按钮（Danger）**
```
背景：Error
文字：白色
Hover：背景加深
```

### 8.2 Input 输入框

```
背景：Surface
边框：1px solid Border
圆角：radius-md
内边距：12px 16px
字体：Body
Placeholder：Text Tertiary
Focus：边框 Brand Blue，外发光阴影
错误：边框 Error，下方显示错误文字
过渡：150ms ease-out
```

### 8.3 Card 卡片

```
背景：Background（白色）
边框：1px solid Border
圆角：radius-lg
内边距：space-5（20px）
阴影：shadow-sm
Hover：translateY(-4px)，shadow-md
过渡：250ms ease-out

内部结构：
  - 顶部：语言Badge + 操作菜单（...）
  - 中部：标题（H2），最多2行，溢出省略
  - 下部：标签列表（Tag组件）
  - 底部：创建时间（Caption）
```

### 8.4 Tag 标签

```
背景：Surface
文字：Text Secondary，12px
内边距：4px 12px
圆角：radius-full
边框：1px solid Border

选中状态：
  背景：Brand Blue（15%透明度）
  文字：Brand Blue
  边框：Brand Blue（30%透明度）

Hover（未选中）：
  背景：Surface Hover
```

### 8.5 CodeBlock 代码块

```
背景：#1D1D1F（深色背景，与Apple Xcode风格一致）
文字：白色系（PrismJS语法高亮）
圆角：radius-lg
内边距：space-5
字体：Code
最大高度：400px（超出滚动）

右上角：复制按钮（悬浮显示）
  - 背景：rgba(255,255,255,0.1)
  - 圆角：radius-md
  - Hover：背景 rgba(255,255,255,0.2)
```

### 8.6 Modal / SlideOver

**模态框（Modal）**
```
遮罩：rgba(0, 0, 0, 0.4) + backdrop-filter: blur(8px)
面板：Background，圆角 radius-xl
最大宽度：560px
内边距：space-8
阴影：shadow-xl
```

**侧边面板（SlideOver）**
```
遮罩：同上
面板：
  - 宽度：480px（桌面），100%（移动端）
  - 背景：Background
  - 从右侧滑入
  - 阴影：shadow-xl
```

### 8.7 Toast 提示

```
位置：页面底部居中，距底 32px
背景：rgba(29, 29, 31, 0.9) + backdrop-filter: blur(12px)
文字：白色，14px
圆角：radius-full
内边距：12px 24px
阴影：shadow-lg
最大宽度：400px
```

### 8.8 EmptyState 空状态

```
布局：垂直居中
图标：48px，Text Tertiary 颜色
标题：H1，Text Primary
描述：Body，Text Secondary
按钮：主按钮，引导创建第一个片段
间距：图标与标题 24px，标题与描述 12px，描述与按钮 32px
```

### 8.9 Skeleton 骨架屏

```
背景：线性渐变动画（shimmer效果）
基础色：#F5F5F7
高光色：#EBEBF0
动画：左右滑动，1.5s循环
圆角：与对应组件一致
```

---

## 9. 响应式设计

### 9.1 断点

| 名称 | 宽度 | 说明 |
|------|------|------|
| Mobile | < 640px | 手机 |
| Tablet | 640px - 1024px | 平板 |
| Desktop | > 1024px | 桌面 |

### 9.2 布局适配

**桌面（>1024px）**
- 页面最大宽度：1200px，居中
- 卡片网格：3列，间距 24px
- 搜索栏：位于Header中央，宽度 480px
- SlideOver：右侧滑出，宽度 480px

**平板（640-1024px）**
- 页面边距：24px
- 卡片网格：2列，间距 20px
- 搜索栏：全宽
- SlideOver：右侧滑出，宽度 400px

**手机（<640px）**
- 页面边距：16px
- 卡片网格：1列，间距 16px
- 搜索栏：全宽，可折叠
- SlideOver：全屏
- 标签筛选：横向滚动

---

## 10. 交互模式

### 10.1 操作流程

**创建代码片段**
```
点击"新建"按钮
  → 打开 SlideOver（350ms动画）
  → 聚焦标题输入框
填写表单
  → 实时验证
  → 语言选择下拉展开
点击保存
  → 按钮显示 loading 状态
  → API调用
  → 成功：SlideOver关闭 + Toast提示 + 列表刷新（新项顶部淡入）
  → 失败：表单显示错误信息
```

**搜索代码片段**
```
输入关键词
  → 300ms 防抖
  → 显示 Skeleton 骨架屏
  → API调用
  → 列表更新（stagger淡入）
  → 无结果：显示 EmptyState
```

**复制代码**
```
点击复制按钮
  → 调用 Clipboard API
  → 按钮图标变为对勾 + 颜色变绿 + 弹跳
  → 显示 Toast："已复制到剪贴板"
  → 2s后按钮恢复原状
```

### 10.2 键盘快捷键

| 快捷键 | 功能 |
|--------|------|
| Cmd/Ctrl + K | 聚焦搜索栏 |
| Cmd/Ctrl + N | 新建代码片段 |
| Esc | 关闭模态框/SlideOver |
| Cmd/Ctrl + Enter | 保存表单 |

---

## 11. 图标系统

采用 **Lucide React** 图标库，风格为简洁的线性图标（与Apple设计语言一致）。

| 图标 | 用途 |
|------|------|
| Search | 搜索栏 |
| Plus | 新建按钮 |
| Copy | 复制代码 |
| Check | 复制成功 |
| X | 关闭、删除 |
| Pencil | 编辑 |
| Trash2 | 删除 |
| Tag | 标签 |
| Code | 代码 |
| Terminal | 语言 |
| ChevronDown | 下拉展开 |
| Filter | 筛选 |
| MoreHorizontal | 更多操作 |
| Command | 快捷键提示 |
