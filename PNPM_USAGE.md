# PNPM 使用说明

本项目已配置为使用 pnpm 作为包管理器。

## 常用命令

### 安装依赖
```bash
pnpm install
# 或者简写
pnpm i
```

### 添加依赖
```bash
# 添加生产依赖
pnpm add <package-name>

# 添加开发依赖
pnpm add -D <package-name>

# 添加全局依赖
pnpm add -g <package-name>
```

### 运行脚本
```bash
# 开发模式
pnpm dev

# 构建项目
pnpm build

# 启动生产服务器
pnpm start

# 运行 lint
pnpm lint
```

### 其他常用命令
```bash
# 更新依赖
pnpm update

# 删除依赖
pnpm remove <package-name>

# 查看依赖树
pnpm list

# 清理缓存
pnpm store prune
```

## 项目配置

- `package.json` 中已添加 `packageManager` 字段指定使用 pnpm
- `.npmrc` 文件配置了 pnpm 的行为
- `pnpm-workspace.yaml` 定义了工作区配置
- 依赖锁定文件：`pnpm-lock.yaml`

## 优势

1. **更快的安装速度**：pnpm 使用硬链接和符号链接
2. **更少的磁盘空间**：依赖存储在全局存储中
3. **更严格的依赖管理**：避免 phantom dependencies
4. **更好的 monorepo 支持**：内置工作区功能 