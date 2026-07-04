# 部署文档

## 1. 环境要求

| 依赖 | 版本 | 说明 |
|------|------|------|
| Docker | 24.x+ | 容器引擎 |
| Docker Compose | 2.x+ | 多容器编排 |
| Node.js | 20.x | 仅本地开发需要 |
| npm | 10.x | 仅本地开发需要 |

---

## 2. 生产部署（Docker Compose）

### 2.1 一键启动

```bash
# 克隆项目后进入根目录
cd code-snippet-vault

# 启动所有服务（后台运行）
docker compose up -d

# 查看日志
docker compose logs -f

# 停止服务
docker compose down
```

### 2.2 访问服务

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端页面 | http://localhost | Nginx托管的React应用 |
| 后端API | http://localhost/api | NestJS REST API |
| MongoDB | mongodb://localhost:27017 | 数据库（仅宿主机访问） |

### 2.3 Docker Compose 配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - '80:80'
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/snippet_vault
      - PORT=3000
    ports:
      - '3000:3000'
    depends_on:
      - mongodb
    networks:
      - app-network

  mongodb:
    image: mongo:7
    volumes:
      - mongodb_data:/data/db
    ports:
      - '27017:27017'
    networks:
      - app-network

volumes:
  mongodb_data:

networks:
  app-network:
    driver: bridge
```

---

## 3. 本地开发

### 3.1 启动数据库

```bash
# 仅启动 MongoDB
docker run -d \
  --name snippet-mongo \
  -p 27017:27017 \
  -v mongo_data:/data/db \
  mongo:7
```

### 3.2 启动后端

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

后端服务运行在 http://localhost:3000

### 3.3 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端服务运行在 http://localhost:5173

### 3.4 开发环境变量

```bash
# backend/.env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/snippet_vault
PORT=3000

# frontend/.env（Vite环境变量需以VITE_开头）
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 4. Dockerfile

### 4.1 前端 Dockerfile

```dockerfile
# frontend/Dockerfile
# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx配置：API请求代理到后端
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        proxy_pass http://backend:3000/api; \
        proxy_http_version 1.1; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
```

### 4.2 后端 Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# 复制项目文件
COPY . .

# 安装全部依赖（包含TypeScript编译器等devDependencies）
RUN npm ci

# 构建 TypeScript
RUN npm run build

# 安装生产运行时依赖，清理缓存
RUN npm ci --only=production && npm cache clean --force

EXPOSE 3000

CMD ["node", "dist/main"]
```

---

## 5. 环境变量说明

### 5.1 后端环境变量

| 变量名 | 必填 | 默认值 | 说明 |
|--------|------|--------|------|
| NODE_ENV | 否 | development | 运行环境 |
| PORT | 否 | 3000 | 服务端口 |
| MONGODB_URI | 否 | mongodb://mongodb:27017/snippet_vault | MongoDB连接字符串 |
| CORS_ORIGIN | 否 | * | 允许的跨域来源 |

### 5.2 前端环境变量

| 变量名 | 必填 | 默认值 | 说明 |
|--------|------|--------|------|
| VITE_API_BASE_URL | 否 | /api | API基础路径 |

---

## 6. 数据持久化

MongoDB数据通过 Docker Volume 持久化：

```bash
# 查看数据卷
docker volume ls

# 备份数据卷
docker run --rm -v snippet_vault_mongodb_data:/data -v $(pwd):/backup alpine tar cvf /backup/mongodb_backup.tar /data

# 恢复数据卷
docker run --rm -v snippet_vault_mongodb_data:/data -v $(pwd):/backup alpine tar xvf /backup/mongodb_backup.tar -C /
```

---

## 7. 健康检查

```yaml
# 在 docker-compose.yml 各服务中添加
services:
  backend:
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3000/api/snippets']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

  mongodb:
    healthcheck:
      test: ['CMD', 'mongosh', '--eval', 'db.adminCommand("ping")']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
```

---

## 8. 日志管理

```bash
# 查看所有服务日志
docker compose logs

# 查看指定服务日志
docker compose logs -f backend

# 限制日志大小（防止磁盘占满）
# 在 docker-compose.yml 中添加
services:
  backend:
    logging:
      driver: 'json-file'
      options:
        max-size: '10m'
        max-file: '3'
```

---

## 9. 扩展部署（可选）

### 9.1 使用 Docker Swarm

```bash
# 初始化 Swarm
docker swarm init

# 部署 Stack
docker stack deploy -c docker-compose.yml snippet-vault

# 查看服务
docker service ls
```

### 9.2 使用 Kubernetes（生产环境）

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: snippet-vault

# k8s/deployment.yaml（示例片段）
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: snippet-vault
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: snippet-vault/backend:latest
          ports:
            - containerPort: 3000
          env:
            - name: MONGODB_URI
              valueFrom:
                secretKeyRef:
                  name: mongodb-secret
                  key: uri
```

---

## 10. 故障排查

| 现象 | 可能原因 | 解决方案 |
|------|---------|----------|
| 前端页面空白 | 后端未启动或API代理配置错误 | 检查backend容器状态，查看Nginx配置 |
| API返回500 | MongoDB连接失败 | 检查mongodb容器是否运行，确认MONGODB_URI |
| 搜索无结果 | MongoDB全文索引未创建 | 进入MongoDB容器执行 `db.snippets.createIndex({title: "text", description: "text", code: "text"})` |
| 构建失败 | Node版本不兼容 | 确认使用 Node.js 20.x |
| 端口冲突 | 80或3000端口被占用 | 修改 docker-compose.yml 端口映射 |
