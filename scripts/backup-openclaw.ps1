# OpenClaw 自动备份脚本
# 功能：压缩 .openclaw 文件夹为7z，保存到 D:\backup，清理旧备份

$backupDir = "D:\backup"
$sourceDir = "$env:USERPROFILE\.openclaw"
$dateStr = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupName = "openclaw_backup_$dateStr.7z"
$backupPath = Join-Path $backupDir $backupName

# 确保备份目录存在
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force
}

# 清理旧备份（只保留最新的一个）
$oldBackups = Get-ChildItem -Path $backupDir -Filter "openclaw_backup_*.7z" | Sort-Object LastWriteTime -Descending
if ($oldBackups.Count -gt 1) {
    $oldBackups | Select-Object -Skip 1 | Remove-Item -Force
    Write-Host "已清理旧备份，保留最新1个"
}

# 创建新备份（使用7z）
$sevenZip = "C:\Program Files\7-Zip\7z.exe"
if (Test-Path $sevenZip) {
    & $sevenZip a -t7z "$backupPath" "$sourceDir\*" -mx=5
    Write-Host "备份完成: $backupPath"
} else {
    # 备用：使用压缩文件夹
    Compress-Archive -Path "$sourceDir\*" -DestinationPath "$backupPath.zip" -Force
    Write-Host "备份完成( ZIP): $backupPath.zip"
}