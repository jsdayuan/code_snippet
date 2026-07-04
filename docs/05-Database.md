# 数据库设计

## 1. 数据库选型

**MongoDB 7.0** — 文档型数据库

**选型理由：**
- Snippet数据结构灵活，无固定模式约束
- 无需复杂关联查询，单集合即可满足需求
- 与NestJS + Mongoose技术栈天然契合
- 标签数组存储方便，支持多条件筛选

## 2. 集合设计

### 2.1 snippets（代码片段集合）

```typescript
// schemas/snippet.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SnippetDocument = Snippet & Document;

@Schema({ timestamps: true })
export class Snippet {
  @Prop({
    required: [true, '标题不能为空'],
    minlength: [1, '标题至少需要1个字符'],
    maxlength: [100, '标题最多100个字符'],
    trim: true,
  })
  title: string;

  @Prop({
    required: [true, '编程语言不能为空'],
    enum: {
      values: [
        'javascript', 'typescript', 'python', 'java', 'go', 'rust',
        'css', 'html', 'shell', 'sql', 'json', 'yaml',
        'markdown', 'c', 'cpp',
      ],
      message: '不支持的语言类型: {VALUE}',
    },
  })
  language: string;

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: (tags: string[]) =>
        tags.every((tag) => tag.length >= 1 && tag.length <= 20),
      message: '每个标签长度必须在1-20字符之间',
    },
  })
  tags: string[];

  @Prop({
    maxlength: [500, '描述最多500个字符'],
    trim: true,
    default: '',
  })
  description: string;

  @Prop({
    required: [true, '代码内容不能为空'],
    minlength: [1, '代码内容至少需要1个字符'],
    maxlength: [10000, '代码内容最多10000个字符'],
  })
  code: string;

  // timestamps: true 自动生成
  createdAt: Date;
  updatedAt: Date;
}

export const SnippetSchema = SchemaFactory.createForClass(Snippet);
```

### 2.2 字段约束汇总

| 字段 | 类型 | 必填 | 最小长度 | 最大长度 | 其他约束 |
|------|------|------|----------|----------|----------|
| title | String | 是 | 1 | 100 | 自动trim |
| language | String | 是 | - | - | 枚举值校验 |
| tags | [String] | 否 | - | - | 每项1-20字符 |
| description | String | 否 | 0 | 500 | 自动trim，默认空字符串 |
| code | String | 是 | 1 | 10000 | - |
| createdAt | Date | 自动 | - | - | 创建时自动写入 |
| updatedAt | Date | 自动 | - | - | 更新时自动刷新 |

## 3. 索引设计

```typescript
// 在 SnippetSchema 定义后添加索引

// 1. 标题全文搜索索引
SnippetSchema.index({ title: 'text', description: 'text', code: 'text' });

// 2. 语言筛选索引
SnippetSchema.index({ language: 1 });

// 3. 标签筛选索引
SnippetSchema.index({ tags: 1 });

// 4. 复合索引：语言+标签（优化组合筛选）
SnippetSchema.index({ language: 1, tags: 1 });

// 5. 创建时间倒序索引（列表默认排序）
SnippetSchema.index({ createdAt: -1 });
```

### 3.1 索引说明

| 索引 | 类型 | 用途 | 预期性能提升 |
|------|------|------|-------------|
| title_text_description_text_code_text | 全文索引 | 关键词搜索 | 从全表扫描优化到索引搜索 |
| language_1 | 单字段索引 | 按语言筛选 | O(n) → O(log n) |
| tags_1 | 单字段索引 | 按标签筛选 | O(n) → O(log n) |
| language_1_tags_1 | 复合索引 | 语言+标签组合筛选 | 避免多索引合并 |
| createdAt_-1 | 单字段索引 | 按时间倒序排列 | 避免内存排序 |

## 4. 查询模式

### 4.1 获取全部（支持筛选）

```typescript
// 无筛选
Snippet.find().sort({ createdAt: -1 });

// 按语言筛选
Snippet.find({ language: 'javascript' }).sort({ createdAt: -1 });

// 按标签筛选（AND逻辑）
Snippet.find({ tags: { $all: ['react', 'hooks'] } }).sort({ createdAt: -1 });

// 组合筛选
Snippet.find({
  language: 'javascript',
  tags: { $all: ['react'] },
}).sort({ createdAt: -1 });
```

### 4.2 全文搜索

```typescript
Snippet.find(
  { $text: { $search: keyword } },
  { score: { $meta: 'textScore' } }
).sort({ score: { $meta: 'textScore' } });
```

### 4.3 聚合统计（扩展）

```typescript
// 按语言分组统计
Snippet.aggregate([
  { $group: { _id: '$language', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
]);

// 获取所有唯一标签
Snippet.aggregate([
  { $unwind: '$tags' },
  { $group: { _id: '$tags', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
]);
```

## 5. 数据迁移与初始化

### 5.1 初始种子数据

```typescript
// seeds/snippets.seed.ts
export const seedSnippets = [
  {
    title: 'JavaScript 数组去重',
    language: 'javascript',
    tags: ['array', 'es6'],
    description: '使用 Set 快速去重',
    code: "const unique = [...new Set(array)];",
  },
  {
    title: 'Python 列表推导式',
    language: 'python',
    tags: ['list', 'basics'],
    description: '简洁的列表创建方式',
    code: "squares = [x**2 for x in range(10)]",
  },
  {
    title: 'TypeScript 接口定义',
    language: 'typescript',
    tags: ['type', 'interface'],
    description: '定义对象类型结构',
    code: "interface User {\n  id: string;\n  name: string;\n  email: string;\n}",
  },
];
```

### 5.2 数据库初始化脚本

```typescript
// 启动时检查并插入种子数据（仅开发环境）
async function seedDatabase() {
  const count = await SnippetModel.countDocuments();
  if (count === 0) {
    await SnippetModel.insertMany(seedSnippets);
    console.log('数据库已初始化种子数据');
  }
}
```

## 6. 备份策略（生产环境扩展）

```bash
# MongoDB 定时备份脚本（cron每日执行）
mongodump --host localhost:27017 --db snippet_vault --out /backup/$(date +%Y%m%d)

# 保留最近7天备份，自动清理
find /backup -type d -mtime +7 -exec rm -rf {} +
```

## 7. 连接配置

```typescript
// backend/src/config/database.config.ts
export const databaseConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://mongodb:27017/snippet_vault',
  options: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
};
```
