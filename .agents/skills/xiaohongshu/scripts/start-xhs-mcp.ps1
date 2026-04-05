#!/usr/bin/env pwsh
# 小红书 MCP Windows 启动脚本
# 使用已有的 openclaw 浏览器上下文（已登录状态）

$XHS_MCP_PATH = "$env:APPDATA\npm\node_modules\xiaohongshu-mcp\cli.js"
$LOG_FILE = "$env:USERPROFILE\.xiaohongshu\mcp.log"
$CDP_URL = "http://127.0.0.1:28800"

# 检查 xiaohongshu-mcp 是否安装
if (-not (Test-Path $XHS_MCP_PATH)) {
    Write-Host "[ERROR] xiaohongshu-mcp 未安装"
    Write-Host "运行: npm install -g xiaohongshu-mcp"
    exit 1
}

# 写入日志
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
"[${timestamp}] Starting xiaohongshu-mcp (stdio mode, CDP connected)" | Out-File $LOG_FILE -Append

# 通过 stdio 启动 MCP，连接到 openclaw 浏览器
# Playwright 会在启动时使用已保存的 cookie
node $XHS_MCP_PATH --headless 2>&1 | Out-File $LOG_FILE -Append
