# 部署方案

## 1. 部署概述

本项目为纯前端应用，所有数据存储在客户端 localStorage 中，无需后端服务和数据库。部署方式简单灵活，支持多种平台。

## 2. 构建项目

### 2.1 安装依赖

```bash
cd frontend
npm install
```

### 2.2 构建生产版本

```bash
npm run build
```

构建产物将生成在 `frontend/dist` 目录中。

## 3. 部署方式

### 3.1 静态文件托管（推荐）

#### 3.1.1 Vercel（最快部署）

```bash
npm install -g vercel
cd frontend
vercel
```

**特点：**
- 一键部署，无需配置
- 自动SSL证书
- 全球CDN加速
- 免费额度充足

#### 3.1.2 Netlify

```bash
npm install -g netlify-cli
cd frontend
netlify deploy --prod
```

**特点：**
- 免费版支持自定义域名
- 自动构建部署
- 表单处理功能

#### 3.1.3 GitHub Pages

```bash
cd frontend
npm install gh-pages --save-dev
```

在 `package.json` 中添加：

```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/code-snippet-vault"
}
```

部署命令：

```bash
npm run build
npm run deploy
```

### 3.2 自托管服务器

#### 3.2.1 Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/code-snippet-vault/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 启用 Gzip 压缩
    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

#### 3.2.2 Apache 配置

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/code-snippet-vault/dist

    <Directory /var/www/code-snippet-vault/dist>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

## 4. 环境变量

纯前端应用无需环境变量配置。所有配置通过代码常量管理。

## 5. 部署检查清单

- [ ] 已执行 `npm run build` 构建生产版本
- [ ] 确保 `dist` 目录包含完整的构建产物
- [ ] 配置正确的域名解析（如有）
- [ ] 启用 HTTPS（推荐）
- [ ] 配置 CDN（可选）

## 6. 数据迁移

由于数据存储在客户端 localStorage 中，无需数据迁移。每个用户的数据独立存储在自己的浏览器中。

## 7. 更新部署

### 7.1 Vercel/Netlify

- 推送代码到 GitHub
- 自动触发构建和部署

### 7.2 自托管服务器

```bash
cd frontend
npm run build
scp -r dist/* user@server:/var/www/code-snippet-vault/dist
```

## 8. 常见问题

### 8.1 路由刷新 404

确保服务器配置了 SPA 路由回退到 `index.html`。

### 8.2 localStorage 数据丢失

- 用户清除浏览器数据会导致数据丢失
- 建议定期导出重要代码片段
- 考虑实现数据导出/导入功能

### 8.3 存储空间不足

- localStorage 容量限制约 5MB
- 超过限制时会抛出异常
- 建议限制单条代码片段大小