# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-12-04

### Added
- ✨ **Windows support!** Now works on Windows, macOS, and Linux
- Added PowerShell script (`check-dev-services.ps1`) for Windows users
- Windows-specific process detection using `netstat`, `tasklist`, and `wmic`
- Cross-platform package.json reading using Node.js `fs` module
- Automatic OS detection and platform-specific command execution
- Support for Angular CLI and Create React App detection
- Display OS platform in output

### Changed
- Refactored main script to support multiple platforms
- Improved package.json reading (now uses `fs.readFileSync` instead of shell commands)
- Enhanced service type detection logic
- Updated package.json to include Windows in supported OS list

### Documentation
- Updated README with Windows usage instructions
- Added PowerShell setup guide for Windows users
- Updated system requirements section for all platforms

## [1.0.0] - 2024-12-04

### Added
- Initial release
- Automatic detection of Node.js development servers
- Support for Webpack, Vite, Next.js, Nuxt.js, Vue CLI
- Display process ID, port, working directory, project info
- Node.js version (check-dev-services.js)
- Shell version (check-dev-services.sh)
- Smart service type recognition
- Package.json parsing for project information
- Comprehensive documentation in English and Chinese

### Features
- Zero dependencies
- Works with services started via npm, yarn, pnpm
- Cross-platform support (macOS, Linux)
- Multiple usage options (direct execution, global command, alias)

## [Unreleased]

### Planned
- Configuration file support
- Filter by port range
- Export results to JSON/CSV
- Watch mode for continuous monitoring
- Integration with popular IDEs
