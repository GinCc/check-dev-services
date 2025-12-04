# Dev Server Checker

<div align="center">

**[English](README.md)** | 简体中文

🔍 一个简单但强大的跨平台 CLI 工具，用于检测本机正在运行的前端开发服务器

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D12.0.0-brightgreen)](https://nodejs.org/)
[![npm version](https://img.shields.io/npm/v/dev-server-checker.svg)](https://www.npmjs.com/package/dev-server-checker)

</div>

---

## 📖 简介

作为前端开发者，你是否遇到过这些问题？

- 🤔 忘记开发服务器运行在哪个端口
- 🔍 不知道电脑上有哪些项目正在运行
- 💻 多个项目同时开发，端口混乱
- ⚡ 想快速查看所有开发服务的状态

**Dev Server Checker** 帮你解决这些问题！一条命令，显示所有正在运行的前端开发服务器的详细信息。

## ✨ 功能特性

- ✅ **自动检测** - 自动发现所有监听端口的 Node.js 开发服务
- 🎯 **智能识别** - 自动识别服务类型（Webpack、Vite、Next.js、Nuxt.js 等）
- 📊 **详细信息** - 显示端口、项目目录、项目名称、版本等
- 🚀 **零配置** - 无需配置，开箱即用
- 💡 **轻量级** - 无依赖，纯 Node.js 实现
- 🌍 **跨平台** - 支持 Windows、macOS、Linux

## 🎬 演示

```bash
$ check-dev

==========================================
检测正在运行的前端开发服务
==========================================

找到 3 个开发服务:

------------------------------------------
进程 ID: 12345
服务类型: Webpack
命令: webpack serve --mode development
工作目录: /Users/username/projects/my-app
项目信息:
  名称: my-app
  版本: 1.0.0
监听端口:
  - http://localhost:8080

------------------------------------------
进程 ID: 12346
服务类型: Vite
命令: vite --port 3000
工作目录: /Users/username/projects/vite-project
项目信息:
  名称: vite-project
  版本: 2.1.0
监听端口:
  - http://localhost:3000

------------------------------------------
进程 ID: 12347
服务类型: Next.js
命令: next dev
工作目录: /Users/username/projects/next-app
项目信息:
  名称: next-app
  版本: 3.0.0
监听端口:
  - http://localhost:4000

==========================================
```

## 📦 安装

### 方式 1: NPM 安装（推荐）

```bash
# 全局安装
npm install -g dev-server-checker

# 或使用 yarn
yarn global add dev-server-checker

# 或使用 pnpm
pnpm add -g dev-server-checker
```

安装后可以直接使用多个命令：
```bash
check-dev    # 主命令
cdev         # 短名称
dev-check    # 别名
```

### 方式 2: 克隆仓库（开发者）

```bash
git clone https://github.com/GinCc/check-dev-services.git
cd check-dev-services
npm link  # 本地链接测试
```

## 🚀 使用方法

安装后直接使用：

```bash
# 主命令
check-dev

# 或使用别名
cdev
dev-check
```

就这么简单！✨ npm 会自动处理所有平台的兼容性。

## 💡 常见使用场景

**场景 1: 忘记端口号**
```bash
$ check-dev
# 快速找到项目运行的端口
```

**场景 2: 多项目开发**
```bash
$ check-dev
# 看到所有正在运行的项目和端口
# Project A: http://localhost:3000
# Project B: http://localhost:8080
```

**场景 3: 端口冲突**
```bash
$ npm run dev
# Error: Port 3000 is already in use

$ check-dev
# 找到占用 3000 端口的进程
```

## 🔧 系统要求

- Node.js >= 12.0.0
- 支持系统：
  - ✅ Windows 7+
  - ✅ macOS 10.10+
  - ✅ Linux (任何现代发行版)

就这么简单！无需额外依赖。

## 🎯 支持的框架

- ✅ Webpack / Webpack Dev Server
- ✅ Vite
- ✅ Next.js
- ✅ Nuxt.js
- ✅ Vue CLI
- ✅ Create React App
- ✅ Angular CLI
- ✅ 其他基于 Node.js 的开发服务器

## 🔍 工作原理

根据不同操作系统使用相应的系统命令：
- **Windows**: `netstat`, `tasklist`, `wmic`
- **macOS/Linux**: `lsof`, `ps`

自动分析进程信息、读取 `package.json`，智能识别服务类型。

## 🤝 问题反馈

遇到问题？[提交 Issue](https://github.com/GinCc/check-dev-services/issues)

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

## ⭐ 支持项目

如果这个工具对你有帮助，请给个 Star！

---

<div align="center">

Made with ❤️ for frontend developers

</div>
