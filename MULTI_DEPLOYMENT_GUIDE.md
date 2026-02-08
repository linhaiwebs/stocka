# 多部署配置指南 / Multi-Deployment Guide

本项目支持在同一服务器上运行多个完全独立的部署实例。每个部署都有自己的容器、卷、网络和数据库。

This project supports running multiple completely independent deployment instances on the same server. Each deployment has its own containers, volumes, network, and database.

## 快速开始 / Quick Start

### 1. 准备环境文件 / Prepare Environment File

项目中已包含多个示例环境文件：

The project includes several example environment files:

- `.env.docker.project1` - 第一个项目 (端口 7400-7401)
- `.env.docker.project2` - 第二个项目 (端口 7500-7501)
- `.env.docker.project3` - 第三个项目 (端口 7600-7601)

### 2. 切换到目标项目 / Switch to Target Project

使用切换脚本快速切换环境：

Use the switch script to quickly change environments:

```bash
bash scripts/switch-env.sh project1
```

或者手动复制环境文件：

Or manually copy the environment file:

```bash
cp .env.docker.project1 .env.docker
```

### 3. 部署项目 / Deploy Project

运行部署命令：

Run the deployment command:

```bash
npm run docker:deploy
```

部署脚本会自动：
- 生成唯一的 JWT_SECRET（如果未设置）
- 使用 COMPOSE_PROJECT_NAME 创建独立的容器
- 创建独立的 Docker 卷和网络
- 设置统一的管理员密码：Mm123567..

The deployment script will automatically:
- Generate a unique JWT_SECRET (if not set)
- Create independent containers using COMPOSE_PROJECT_NAME
- Create independent Docker volumes and networks
- Set unified admin password: Mm123567..

## 管理多个部署 / Managing Multiple Deployments

### 切换环境 / Switch Environment

```bash
# 查看所有可用的环境文件
bash scripts/switch-env.sh

# 切换到特定项目
bash scripts/switch-env.sh project1
bash scripts/switch-env.sh project2
bash scripts/switch-env.sh project3
```

### 查看运行中的部署 / View Running Deployments

```bash
bash scripts/list-deployments.sh
```

### 生成新的 JWT Secret

```bash
bash scripts/generate-jwt.sh
```

## 创建新项目 / Create New Project

### 方法 1：使用现有模板 / Method 1: Use Existing Template

```bash
# 复制现有的环境文件
cp .env.docker.project1 .env.docker.project4

# 编辑新文件
nano .env.docker.project4
```

### 方法 2：从示例创建 / Method 2: Create from Example

```bash
# 从示例模板创建
cp .env.docker.example .env.docker.myproject

# 编辑配置
nano .env.docker.myproject
```

### 必须修改的配置项 / Required Configuration Changes

1. **COMPOSE_PROJECT_NAME** - 必须唯一 / Must be unique
   ```bash
   COMPOSE_PROJECT_NAME=myproject
   ```

2. **端口号 / Port Numbers** - 避免冲突 / Avoid conflicts
   ```bash
   FRONTEND_PORT=7700  # 必须不同
   BACKEND_PORT=7701   # 必须不同
   ```

3. **域名配置 / Domain Configuration**
   ```bash
   FRONTEND_MAIN_DOMAIN=myproject.com
   VITE_DOMAIN_MAIN=myproject.com
   VITE_DOMAIN_ADMIN=admin.myproject.com
   CORS_ADMIN_ORIGINS=https://admin.myproject.com,https://myproject.com
   CORS_TEMPLATE_ORIGINS=https://myproject.com,https://www.myproject.com
   ```

4. **JWT_SECRET** - 留空自动生成 / Leave empty for auto-generation
   ```bash
   JWT_SECRET=
   ```

5. **管理员密码 / Admin Password** - 统一设置 / Unified setting
   ```bash
   ADMIN_PASSWORD=Mm123567..
   ```

## 推荐的端口分配 / Recommended Port Assignment

| 项目 / Project | Frontend Port | Backend Port | Range |
|---------------|---------------|--------------|-------|
| Project 1     | 7400          | 7401         | 7400-7499 |
| Project 2     | 7500          | 7501         | 7500-7599 |
| Project 3     | 7600          | 7601         | 7600-7699 |
| Project 4     | 7700          | 7701         | 7700-7799 |
| Project 5     | 7800          | 7801         | 7800-7899 |

## Docker 命令 / Docker Commands

### 查看所有容器 / View All Containers

```bash
docker ps -a
```

### 查看特定项目的容器 / View Specific Project Containers

```bash
docker ps -a | grep project1
```

### 停止特定项目 / Stop Specific Project

```bash
# 先切换到对应项目
bash scripts/switch-env.sh project1

# 停止容器
npm run docker:down
```

### 重启特定项目 / Restart Specific Project

```bash
# 先切换到对应项目
bash scripts/switch-env.sh project1

# 重启容器
npm run docker:restart
```

### 查看日志 / View Logs

```bash
# 查看特定容器日志
docker logs project1-backend
docker logs project1-frontend

# 实时查看日志
docker logs -f project1-backend
```

### 清理未使用的资源 / Clean Up Unused Resources

```bash
# 清理停止的容器
docker container prune

# 清理未使用的卷
docker volume prune

# 清理未使用的网络
docker network prune

# 清理所有未使用的资源
docker system prune -a
```

## 数据备份 / Data Backup

每个项目的数据存储在独立的 Docker 卷中：

Each project's data is stored in independent Docker volumes:

- `{COMPOSE_PROJECT_NAME}-backend-data` - 数据库文件
- `{COMPOSE_PROJECT_NAME}-backend-backups` - 备份文件

### 备份特定项目 / Backup Specific Project

```bash
# 切换到目标项目
bash scripts/switch-env.sh project1

# 运行备份
npm run docker:backup
```

### 手动导出卷数据 / Manually Export Volume Data

```bash
# 导出数据卷
docker run --rm -v project1-backend-data:/data -v $(pwd):/backup alpine tar czf /backup/project1-data-backup.tar.gz -C /data .

# 导出备份卷
docker run --rm -v project1-backend-backups:/data -v $(pwd):/backup alpine tar czf /backup/project1-backups-backup.tar.gz -C /data .
```

### 恢复卷数据 / Restore Volume Data

```bash
# 恢复数据卷
docker run --rm -v project1-backend-data:/data -v $(pwd):/backup alpine tar xzf /backup/project1-data-backup.tar.gz -C /data

# 恢复备份卷
docker run --rm -v project1-backend-backups:/data -v $(pwd):/backup alpine tar xzf /backup/project1-backups-backup.tar.gz -C /data
```

## 故障排查 / Troubleshooting

### 端口冲突 / Port Conflicts

如果遇到端口冲突：

If you encounter port conflicts:

1. 检查哪个进程占用了端口：
   ```bash
   sudo lsof -i :7400
   sudo netstat -tulpn | grep 7400
   ```

2. 修改 `.env.docker` 中的端口号

3. 重新部署

### 容器名称冲突 / Container Name Conflicts

确保每个项目的 `COMPOSE_PROJECT_NAME` 唯一。

Ensure each project's `COMPOSE_PROJECT_NAME` is unique.

### 查看容器错误 / View Container Errors

```bash
# 查看容器日志
docker logs project1-backend
docker logs project1-frontend

# 进入容器检查
docker exec -it project1-backend sh
```

### 完全重新部署 / Complete Redeployment

```bash
# 停止并删除容器
npm run docker:down

# 清理构建缓存
docker builder prune -a -f

# 重新部署
npm run docker:deploy
```

## 安全建议 / Security Recommendations

1. **JWT Secret** - 每个部署使用不同的 JWT secret
2. **管理员密码** - 在生产环境中修改默认密码
3. **CORS 配置** - 限制为实际使用的域名
4. **防火墙** - 仅开放必要的端口
5. **定期备份** - 设置自动备份计划

## 生产环境配置 / Production Configuration

### 使用 Cloudflare

1. 将域名 DNS 指向服务器
2. 在 Cloudflare 启用代理（橙色云）
3. 更新 `.env.docker` 中的 CORS 配置
4. 重启容器

### 使用 Nginx 反向代理

如果使用外部 Nginx 作为反向代理：

If using external Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name example1.com;

    location / {
        proxy_pass http://localhost:7400;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name example2.com;

    location / {
        proxy_pass http://localhost:7500;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 常见问题 / FAQ

### Q: 可以同时运行多个部署吗？
### Q: Can I run multiple deployments simultaneously?

A: 是的，只要每个部署使用不同的 `COMPOSE_PROJECT_NAME` 和端口号，就可以同时运行多个部署。

A: Yes, as long as each deployment uses a different `COMPOSE_PROJECT_NAME` and port numbers, you can run multiple deployments simultaneously.

### Q: 如何在部署之间共享模板？
### Q: How to share templates between deployments?

A: 所有部署共享同一个 `templates` 目录。修改模板后，需要重新部署相关项目。

A: All deployments share the same `templates` directory. After modifying templates, you need to redeploy the relevant projects.

### Q: 数据库是完全独立的吗？
### Q: Are databases completely independent?

A: 是的，每个部署都有自己独立的 SQLite 数据库，存储在独立的 Docker 卷中。

A: Yes, each deployment has its own independent SQLite database stored in independent Docker volumes.

### Q: 可以迁移数据到另一个部署吗？
### Q: Can I migrate data to another deployment?

A: 可以。导出源数据库，然后导入到目标数据库即可。

A: Yes. Export the source database and import it into the target database.

```bash
# 从 project1 导出
docker exec project1-backend sqlite3 /app/data/landing_pages.db .dump > backup.sql

# 导入到 project2
docker exec -i project2-backend sqlite3 /app/data/landing_pages.db < backup.sql
```

## 支持 / Support

如有问题，请查看项目文档或提交 issue。

For questions, please check the project documentation or submit an issue.
