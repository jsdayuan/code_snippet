import { Snippet } from '../types/snippet';

const STORAGE_KEY = 'code_snippet_vault';
const USER_ID_KEY = 'code_snippet_user_id';

const seedSnippets: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'React use Hook 写法',
    language: 'typescript',
    tags: ['react', 'hooks', 'state'],
    description: '使用 useState Hook 管理组件状态',
    code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      点击次数: {count}
    </button>
  );
}

export default Counter;`,
  },
  {
    title: 'JavaScript 深拷贝',
    language: 'javascript',
    tags: ['utility', 'object', 'es6'],
    description: '实现对象和数组的深拷贝',
    code: `// 使用 structuredClone (现代浏览器)
const deepCopy = structuredClone(original);

// 使用 JSON (不支持函数/Date/RegExp)
const deepCopy = JSON.parse(JSON.stringify(original));

// 递归实现
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  const clone = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}`,
  },
  {
    title: 'Python 装饰器模式',
    language: 'python',
    tags: ['decorator', 'design-pattern', 'basics'],
    description: '使用装饰器实现函数功能扩展',
    code: `import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} 执行时间: {end - start:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "完成"

# 使用
slow_function()`,
  },
  {
    title: 'CSS Flexbox 居中布局',
    language: 'css',
    tags: ['layout', 'flexbox', 'centering'],
    description: '使用 Flexbox 实现水平和垂直居中',
    code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.card {
  max-width: 400px;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}`,
  },
  {
    title: 'TypeScript 泛型函数',
    language: 'typescript',
    tags: ['generic', 'type', 'utility'],
    description: '创建类型安全的泛型函数',
    code: `// 基本泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 带约束的泛型
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 使用示例
const user = { name: "Alice", age: 25 };
const name = getProperty(user, "name"); // string 类型
const age = getProperty(user, "age");   // number 类型

// 泛型接口
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const response: ApiResponse<User> = {
  data: user,
  status: 200,
  message: "success"
};`,
  },
  {
    title: 'SQL 查询优化技巧',
    language: 'sql',
    tags: ['database', 'optimization', 'query'],
    description: '常用 SQL 查询性能优化方法',
    code: `-- 1. 只查询需要的列
SELECT id, name FROM users; -- 好
SELECT * FROM users;        -- 避免

-- 2. 使用索引
CREATE INDEX idx_users_email ON users(email);

-- 3. 避免在 WHERE 子句中使用函数
-- 不推荐
SELECT * FROM users WHERE YEAR(created_at) = 2024;
-- 推荐
SELECT * FROM users WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';

-- 4. 使用 JOIN 代替子查询
SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed';

-- 5. LIMIT 分页
SELECT * FROM large_table ORDER BY id LIMIT 20 OFFSET 40;`,
  },
  {
    title: 'Go 并发编程示例',
    language: 'go',
    tags: ['concurrency', 'goroutine', 'channel'],
    description: '使用 goroutine 和 channel 实现并发',
    code: `package main

import (
	"fmt"
	"time"
)

func worker(id int, jobs <-chan int, results chan<- int) {
	for j := range jobs {
		fmt.Printf("Worker %d 开始任务 %d\n", id, j)
		time.Sleep(time.Second)
		fmt.Printf("Worker %d 完成任务 %d\n", id, j)
		results <- j * 2
	}
}

func main() {
	jobs := make(chan int, 10)
	results := make(chan int, 10)

	// 启动3个worker
	for w := 1; w <= 3; w++ {
		go worker(w, jobs, results)
	}

	// 发送9个任务
	for j := 1; j <= 9; j++ {
		jobs <- j
	}
	close(jobs)

	// 收集结果
	for a := 1; a <= 9; a++ {
		result := <-results
		fmt.Printf("结果: %d\n", result)
	}
}`,
  },
  {
    title: 'Rust 所有权与借用',
    language: 'rust',
    tags: ['ownership', 'borrow', 'memory'],
    description: '理解 Rust 的所有权系统',
    code: `fn main() {
    // 所有权转移
    let s1 = String::from("hello");
    let s2 = s1; // s1 的所有权转移给 s2
    // println!("{}", s1); // 错误！s1 不再有效
    println!("{}", s2); // 正确

    // 借用（引用）
    let s3 = String::from("world");
    let len = calculate_length(&s3); // 借用 s3，不获取所有权
    println!("字符串 '{}' 的长度是 {}", s3, len); // s3 仍然有效

    // 可变借用
    let mut s4 = String::from("hello");
    change_string(&mut s4);
    println!("{}", s4); // hello, world
}

fn calculate_length(s: &String) -> usize {
    s.len()
}

fn change_string(s: &mut String) {
    s.push_str(", world");
}`,
  },
  {
    title: 'Swift 可选类型详解',
    language: 'swift',
    tags: ['optional', 'swift', 'basics'],
    description: '安全处理可能为 nil 的值',
    code: `// 声明可选类型
var name: String? = "Alice"
var age: Int? = nil

// 强制解包（慎用）
if name != nil {
    print("名字是 \(name!)")
}

// if let 安全解包
if let unwrappedName = name {
    print("名字是 \(unwrappedName)")
} else {
    print("名字为空")
}

// guard let 提前退出
func greet(person: String?) {
    guard let name = person else {
        print("你好，陌生人")
        return
    }
    print("你好，\(name)！")
}

// 可选链
class Person {
    var address: Address?
}

class Address {
    var street: String?
}

let person = Person()
let street = person.address?.street // street 是 String? 类型

// nil 合并运算符
let displayName = name ?? "匿名用户"`,
  },
];

function generateUserId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  const hash = `${timestamp}-${random}`;
  return hash;
}

export function getUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

export function getSnippets(): Snippet[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    const initialSnippets = seedSnippets.map((snippet, index) => ({
      ...snippet,
      id: `seed-${index + 1}`,
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - index * 43200000).toISOString(),
    }));
    saveSnippets(initialSnippets);
    return initialSnippets;
  } catch {
    return [];
  }
}

export function saveSnippets(snippets: Snippet[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
}

export function createSnippet(snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>): Snippet {
  const snippets = getSnippets();
  const newSnippet: Snippet = {
    ...snippet,
    id: `snippet-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  snippets.unshift(newSnippet);
  saveSnippets(snippets);
  return newSnippet;
}

export function updateSnippet(id: string, data: Partial<Snippet>): Snippet | null {
  const snippets = getSnippets();
  const index = snippets.findIndex((s) => s.id === id);
  if (index === -1) return null;
  snippets[index] = {
    ...snippets[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  saveSnippets(snippets);
  return snippets[index];
}

export function deleteSnippet(id: string): boolean {
  const snippets = getSnippets();
  const newSnippets = snippets.filter((s) => s.id !== id);
  if (newSnippets.length === snippets.length) return false;
  saveSnippets(newSnippets);
  return true;
}

export function searchSnippets(keyword: string): Snippet[] {
  const snippets = getSnippets();
  const lowerKeyword = keyword.toLowerCase();
  return snippets.filter(
    (s) =>
      s.title.toLowerCase().includes(lowerKeyword) ||
      s.description.toLowerCase().includes(lowerKeyword) ||
      s.code.toLowerCase().includes(lowerKeyword) ||
      s.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))
  );
}

export function filterSnippets(filters?: { language?: string; tags?: string[] }): Snippet[] {
  let snippets = getSnippets();
  if (filters?.language) {
    snippets = snippets.filter((s) => s.language === filters.language);
  }
  if (filters?.tags && filters.tags.length > 0) {
    snippets = snippets.filter((s) => filters.tags!.every((tag) => s.tags.includes(tag)));
  }
  return snippets;
}