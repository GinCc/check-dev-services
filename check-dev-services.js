#!/usr/bin/env node

const { exec } = require('child_process');
const util = require('util');
const os = require('os');
const fs = require('fs');
const path = require('path');
const execPromise = util.promisify(exec);

const isWindows = os.platform() === 'win32';
const isMac = os.platform() === 'darwin';
const isLinux = os.platform() === 'linux';

async function findDevServicesUnix() {
  try {
    // 1. 先找所有监听端口的 node 进程
    const { stdout: lsofOutput } = await execPromise(
      'lsof -iTCP -sTCP:LISTEN -n -P | grep node'
    ).catch(() => ({ stdout: '' }));

    if (!lsofOutput.trim()) {
      console.log('No running Node.js services found');
      return;
    }

    // 解析 lsof 输出，提取 PID 和端口
    const lines = lsofOutput.trim().split('\n');
    const processMap = new Map();

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[1];
      const portMatch = line.match(/:(\d+)\s+\(LISTEN\)/);

      if (portMatch) {
        const port = portMatch[1];
        if (!processMap.has(pid)) {
          processMap.set(pid, []);
        }
        processMap.get(pid).push(port);
      }
    }

    console.log(`Found ${processMap.size} Node.js service(s) listening on ports:\n`);

    let foundDevService = false;

    for (const [pid, ports] of processMap) {
      // 获取进程命令
      const { stdout: cmdOutput } = await execPromise(
        `ps -p ${pid} -o command=`
      ).catch(() => ({ stdout: '' }));

      const cmd = cmdOutput ? cmdOutput.trim() : '';

      // 判断是否为前端开发服务
      const isWebpack = cmd.includes('webpack') || cmd.includes('webpack-dev-server');
      const isVite = cmd.includes('vite');
      const isNode = cmd.includes('node');

      // 如果不是明显的开发服务，先跳过
      if (!isWebpack && !isVite && !isNode) {
        continue;
      }

      // 获取工作目录
      const { stdout: cwdOutput } = await execPromise(
        `lsof -p ${pid} 2>/dev/null | grep cwd | awk '{print $NF}'`
      ).catch(() => ({ stdout: '' }));

      const cwd = cwdOutput.trim();

      // 检查工作目录是否包含前端项目标识
      let hasPackageJson = false;
      let packageInfo = null;

      if (cwd) {
        const packageJsonPath = path.join(cwd, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          hasPackageJson = true;

          try {
            const packageJson = fs.readFileSync(packageJsonPath, 'utf8');
            const pkg = JSON.parse(packageJson);
            packageInfo = {
              name: pkg.name,
              version: pkg.version,
              scripts: pkg.scripts,
              dependencies: pkg.dependencies,
              devDependencies: pkg.devDependencies
            };
          } catch (e) {
            // 解析失败，忽略
          }
        }
      }

      // 判断服务类型
      let serviceType = null;

      if (isWebpack) {
        serviceType = 'Webpack';
      } else if (isVite) {
        serviceType = 'Vite';
      } else if (packageInfo) {
        serviceType = detectServiceType(packageInfo);
      }

      // 如果确定是开发服务，则显示
      if (serviceType || hasPackageJson) {
        foundDevService = true;

        console.log('------------------------------------------');
        console.log(`PID: ${pid}`);

        if (serviceType) {
          console.log(`Service Type: ${serviceType}`);
        }

        console.log(`Command: ${cmd}`);

        if (cwd) {
          console.log(`Working Directory: ${cwd}`);
        }

        if (packageInfo) {
          console.log('Project Info:');
          if (packageInfo.name) console.log(`  Name: ${packageInfo.name}`);
          if (packageInfo.version) console.log(`  Version: ${packageInfo.version}`);
        }

        console.log('Listening Ports:');
        ports.forEach(port => {
          console.log(`  - http://localhost:${port}`);
        });

        console.log('');
      }
    }

    if (!foundDevService) {
      console.log('No frontend dev services found (Webpack/Vite)');
    }

  } catch (error) {
    console.error('Error during detection:', error.message);
  }
}

async function findDevServicesWindows() {
  try {
    // 1. 使用 netstat 查找监听的端口和对应的 PID
    const { stdout: netstatOutput } = await execPromise(
      'netstat -ano | findstr "LISTENING"'
    ).catch(() => ({ stdout: '' }));

    if (!netstatOutput.trim()) {
      console.log('No running services found');
      return;
    }

    // 解析 netstat 输出
    const lines = netstatOutput.trim().split('\n');
    const processMap = new Map();

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 5) continue;

      const localAddress = parts[1];
      const pid = parts[4];

      // 提取端口号
      const portMatch = localAddress.match(/:(\d+)$/);
      if (!portMatch) continue;

      const port = portMatch[1];

      if (!processMap.has(pid)) {
        processMap.set(pid, []);
      }
      if (!processMap.get(pid).includes(port)) {
        processMap.get(pid).push(port);
      }
    }

    let foundDevService = false;
    let nodeProcessCount = 0;

    console.log(`Scanned ${processMap.size} process(es) listening on ports\n`);

    for (const [pid, ports] of processMap) {
      // 获取进程信息
      const { stdout: tasklistOutput } = await execPromise(
        `tasklist /FI "PID eq ${pid}" /FO CSV /NH`
      ).catch(() => ({ stdout: '' }));

      if (!tasklistOutput.trim()) continue;

      // 解析进程名
      const processName = tasklistOutput.split(',')[0].replace(/"/g, '').toLowerCase();

      // 只处理 node.exe 进程
      if (!processName.includes('node')) continue;

      nodeProcessCount++;

      // 获取进程命令行
      const { stdout: wmicOutput } = await execPromise(
        `wmic process where processid=${pid} get commandline /format:list`
      ).catch(() => ({ stdout: '' }));

      const cmd = wmicOutput
        .split('\n')
        .find(line => line.startsWith('CommandLine='))
        ?.replace('CommandLine=', '')
        .trim() || '';

      // 判断是否为前端开发服务
      const isWebpack = cmd.includes('webpack') || cmd.includes('webpack-dev-server');
      const isVite = cmd.includes('vite');
      const isNode = cmd.includes('node');

      // 如果不是明显的开发服务，先跳过
      if (!isWebpack && !isVite && !isNode) {
        continue;
      }

      // 获取工作目录
      let cwd = '';
      const { stdout: cwdOutput } = await execPromise(
        `wmic process where processid=${pid} get executablepath /format:list`
      ).catch(() => ({ stdout: '' }));

      const execPath = cwdOutput
        .split('\n')
        .find(line => line.startsWith('ExecutablePath='))
        ?.replace('ExecutablePath=', '')
        .trim();

      if (execPath) {
        // 尝试从命令行中提取工作目录
        const cwdMatch = cmd.match(/([A-Z]:\\[^"]+?)(?:\\node_modules|\\package\.json|$)/i);
        if (cwdMatch) {
          cwd = cwdMatch[1];
        }
      }

      // 检查 package.json
      let hasPackageJson = false;
      let packageInfo = null;

      if (cwd) {
        const packageJsonPath = path.join(cwd, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          hasPackageJson = true;

          try {
            const packageJson = fs.readFileSync(packageJsonPath, 'utf8');
            const pkg = JSON.parse(packageJson);
            packageInfo = {
              name: pkg.name,
              version: pkg.version,
              scripts: pkg.scripts,
              dependencies: pkg.dependencies,
              devDependencies: pkg.devDependencies
            };
          } catch (e) {
            // 解析失败，忽略
          }
        }
      }

      // 判断服务类型
      let serviceType = null;

      if (isWebpack) {
        serviceType = 'Webpack';
      } else if (isVite) {
        serviceType = 'Vite';
      } else if (packageInfo) {
        serviceType = detectServiceType(packageInfo);
      }

      // 如果确定是开发服务，则显示
      if (serviceType || hasPackageJson) {
        foundDevService = true;

        console.log('------------------------------------------');
        console.log(`PID: ${pid}`);

        if (serviceType) {
          console.log(`Service Type: ${serviceType}`);
        }

        console.log(`Command: ${cmd.substring(0, 200)}${cmd.length > 200 ? '...' : ''}`);

        if (cwd) {
          console.log(`Working Directory: ${cwd}`);
        }

        if (packageInfo) {
          console.log('Project Info:');
          if (packageInfo.name) console.log(`  Name: ${packageInfo.name}`);
          if (packageInfo.version) console.log(`  Version: ${packageInfo.version}`);
        }

        console.log('Listening Ports:');
        ports.forEach(port => {
          console.log(`  - http://localhost:${port}`);
        });

        console.log('');
      }
    }

    if (nodeProcessCount === 0) {
      console.log('No running Node.js services found');
    } else if (!foundDevService) {
      console.log('No frontend dev services found (Webpack/Vite)');
    }

  } catch (error) {
    console.error('Error during detection:', error.message);
  }
}

function detectServiceType(packageInfo) {
  const allDeps = {
    ...packageInfo.dependencies,
    ...packageInfo.devDependencies
  };

  if (!allDeps) return null;

  if (allDeps['webpack'] || allDeps['webpack-dev-server'] || allDeps['webpack-cli']) {
    return 'Webpack';
  } else if (allDeps['vite']) {
    return 'Vite';
  } else if (allDeps['next']) {
    return 'Next.js';
  } else if (allDeps['nuxt']) {
    return 'Nuxt.js';
  } else if (allDeps['vue-cli-service']) {
    return 'Vue CLI';
  } else if (allDeps['@angular/cli']) {
    return 'Angular CLI';
  } else if (allDeps['react-scripts']) {
    return 'Create React App';
  }

  return null;
}

async function findDevServices() {
  console.log('==========================================');
  console.log('Detecting running frontend dev services');
  console.log(`OS: ${os.platform()}`);
  console.log('==========================================\n');

  if (isWindows) {
    await findDevServicesWindows();
  } else {
    await findDevServicesUnix();
  }

  console.log('==========================================');
}

// Export for module usage
module.exports = findDevServices;

// Run if executed directly
if (require.main === module) {
  findDevServices();
}
