# Dev Server Checker

<div align="center">

English | **[简体中文](README.zh-CN.md)**

🔍 A simple but powerful cross-platform CLI tool to detect and display all running frontend development servers

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D12.0.0-brightgreen)](https://nodejs.org/)
[![npm version](https://img.shields.io/npm/v/dev-server-checker.svg)](https://www.npmjs.com/package/dev-server-checker)

</div>

---

## 📖 Introduction

As a frontend developer, have you ever encountered these problems?

- 🤔 Forgot which port your dev server is running on
- 🔍 Don't know which projects are currently running
- 💻 Multiple projects running simultaneously with confusing ports
- ⚡ Want to quickly check the status of all dev servers

**Dev Server Checker** solves these problems! One command to display detailed information about all running frontend development servers.

## ✨ Features

- ✅ **Auto Detection** - Automatically discovers all Node.js dev servers listening on ports
- 🎯 **Smart Recognition** - Automatically identifies service types (Webpack, Vite, Next.js, Nuxt.js, etc.)
- 📊 **Detailed Info** - Shows ports, project directories, project names, versions, etc.
- 🚀 **Zero Config** - No configuration needed, works out of the box
- 💡 **Lightweight** - No dependencies, pure Node.js implementation
- 🌍 **Cross-Platform** - Supports Windows, macOS, and Linux

## 🎬 Demo

```bash
$ check-dev

==========================================
Detecting Running Dev Services
==========================================

Found 3 dev services:

------------------------------------------
Process ID: 12345
Service Type: Webpack
Command: webpack serve --mode development
Working Directory: /Users/username/projects/my-app
Project Info:
  Name: my-app
  Version: 1.0.0
Listening Ports:
  - http://localhost:8080

------------------------------------------
Process ID: 12346
Service Type: Vite
Command: vite --port 3000
Working Directory: /Users/username/projects/vite-project
Project Info:
  Name: vite-project
  Version: 2.1.0
Listening Ports:
  - http://localhost:3000

------------------------------------------
Process ID: 12347
Service Type: Next.js
Command: next dev
Working Directory: /Users/username/projects/next-app
Project Info:
  Name: next-app
  Version: 3.0.0
Listening Ports:
  - http://localhost:4000

==========================================
```

## 📦 Installation

### Option 1: NPM Install (Recommended)

```bash
# Global installation
npm install -g dev-server-checker

# Or using yarn
yarn global add dev-server-checker

# Or using pnpm
pnpm add -g dev-server-checker
```

After installation, you can use multiple commands:
```bash
check-dev    # Main command
cdev         # Short name
dev-check    # Alias
```

### Option 2: Clone Repository (Developers)

```bash
git clone https://github.com/GinCc/check-dev-services.git
cd check-dev-services
npm link  # Link locally for testing
```

## 🚀 Usage

After installation, use directly:

```bash
# Main command
check-dev

# Or use aliases
cdev
dev-check
```

That's it! ✨ npm handles all platform compatibility automatically.

## 💡 Common Use Cases

**Case 1: Forgot the port number**
```bash
$ check-dev
# Quickly find which port your project is running on
```

**Case 2: Multiple projects**
```bash
$ check-dev
# See all running projects and their ports
# Project A: http://localhost:3000
# Project B: http://localhost:8080
```

**Case 3: Port conflict**
```bash
$ npm run dev
# Error: Port 3000 is already in use

$ check-dev
# Find what's using port 3000
```

## 🔧 Requirements

- Node.js >= 12.0.0
- Supported systems:
  - ✅ Windows 7+
  - ✅ macOS 10.10+
  - ✅ Linux (any modern distribution)

That simple! No additional dependencies required.

## 🎯 Supported Frameworks

- ✅ Webpack / Webpack Dev Server
- ✅ Vite
- ✅ Next.js
- ✅ Nuxt.js
- ✅ Vue CLI
- ✅ Create React App
- ✅ Angular CLI
- ✅ Other Node.js-based dev servers

## 🔍 How It Works

Uses platform-specific system commands:
- **Windows**: `netstat`, `tasklist`, `wmic`
- **macOS/Linux**: `lsof`, `ps`

Automatically analyzes process info, reads `package.json`, and intelligently identifies service types.

## 🤝 Feedback

Have issues? [Submit an Issue](https://github.com/GinCc/check-dev-services/issues)

## 📄 License

MIT License - See [LICENSE](LICENSE)

## ⭐ Support

If this tool helps you, please give it a Star!

---

<div align="center">

Made with ❤️ for frontend developers

</div>
