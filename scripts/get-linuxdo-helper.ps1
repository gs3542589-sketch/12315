# Linux.do Cookie 获取助手
# 请在 PowerShell 中运行此脚本

Write-Host "=== Linux.do Cookie 获取助手 ===" -ForegroundColor Green
Write-Host ""
Write-Host "步骤 1: 打开 Edge 并访问 linux.do" -ForegroundColor Yellow
Write-Host "步骤 2: 确保已登录" -ForegroundColor Yellow
Write-Host "步骤 3: 按 F12 打开开发者工具" -ForegroundColor Yellow
Write-Host "步骤 4: 点击 Application 标签" -ForegroundColor Yellow
Write-Host "步骤 5: 在左侧找到 Cookies -> https://linux.do" -ForegroundColor Yellow
Write-Host "步骤 6: 找到 _session_id 或 _t，复制 Value" -ForegroundColor Yellow
Write-Host ""

# 尝试从 Edge 的 SQLite 数据库读取（如果可能）
$edgePaths = @(
    "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Default\Network\Cookies",
    "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Profile 1\Network\Cookies",
    "$env:LOCALAPPDATA\Microsoft\Edge\User Data\Profile 2\Network\Cookies"
)

$found = $false
foreach ($path in $edgePaths) {
    if (Test-Path $path) {
        Write-Host "找到 Edge Cookie 数据库: $path" -ForegroundColor Cyan
        $found = $true
        
        # 尝试使用 PowerShell 读取 SQLite（需要 System.Data.SQLite）
        try {
            Add-Type -Path "$env:USERPROFILE\.qclaw\workspace-agent-1f90a168\System.Data.SQLite.dll" -ErrorAction SilentlyContinue
        } catch {
            # 使用替代方法
        }
    }
}

if (-not $found) {
    Write-Host "未找到 Edge Cookie 数据库" -ForegroundColor Red
}

Write-Host ""
Write-Host "请手动复制以下 Cookie 的值：" -ForegroundColor Green
Write-Host "1. _session_id (或 _t)" -ForegroundColor White
Write-Host "2. cf_clearance" -ForegroundColor White
Write-Host ""
Write-Host "复制后粘贴到这里，然后按回车：" -ForegroundColor Yellow

$cookieInput = Read-Host "粘贴 Cookie JSON 或键值对"

if ($cookieInput) {
    $outputPath = "$env:USERPROFILE\linuxdo-cookies-user.json"
    $cookieInput | Out-File -FilePath $outputPath -Encoding UTF8
    Write-Host "已保存到: $outputPath" -ForegroundColor Green
}
