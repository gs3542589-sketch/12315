# OpenClaw Full Backup Script v2
# Backs up: .openclaw + workspace-agent-1f90a168 -> D:\backup\openclaw_full_backup_YYYY-MM-DD.zip

Add-Type -AssemblyName System.IO.Compression.FileSystem

$backupDir = "D:\backup"
$dateStr = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$finalZip = Join-Path $backupDir "openclaw_full_backup_$dateStr.zip"

$srcOpenclaw = "$env:USERPROFILE\.openclaw"
$srcWorkspace = "$env:USERPROFILE\.qclaw\workspace-agent-1f90a168"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force
}

# Keep latest 3 full backups
Get-ChildItem $backupDir -Filter "openclaw_full_backup_*.zip" -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -Skip 3 |
    Remove-Item -Force -ErrorAction SilentlyContinue

Write-Host "Collecting files from .openclaw..."
$openclawFiles = Get-ChildItem $srcOpenclaw -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\logs\\' -and $_.FullName -notmatch '\\node_modules\\' }

Write-Host "Collecting files from workspace..."
$workspaceFiles = Get-ChildItem $srcWorkspace -Recurse -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\node_modules\\' -and $_.FullName -notmatch '\\\.git\\' -and $_.FullName -notmatch '\\temp\\' -and $_.FullName -notmatch '\\output\\' -and $_.FullName -notmatch '\\logs\\' }

Write-Host "Creating ZIP archive (this may take 1-3 minutes)..."
if (Test-Path $finalZip) { Remove-Item $finalZip -Force }
$zip = [System.IO.Compression.ZipFile]::Open($finalZip, 'Create')
$count = 0
try {
    # Add openclaw files
    foreach ($file in $openclawFiles) {
        $count++
        $relPath = $file.FullName.Substring($srcOpenclaw.Length).TrimStart('\') -replace '\\', '/'
        $entryName = "openclaw/" + $relPath
        try {
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $entryName, 'Optimal') | Out-Null
        } catch { }
    }
    Write-Host "  openclaw: $count files"
    
    # Add workspace files
    $wsCount = 0
    foreach ($file in $workspaceFiles) {
        $wsCount++
        $relPath = $file.FullName.Substring($srcWorkspace.Length).TrimStart('\') -replace '\\', '/'
        $entryName = "workspace/" + $relPath
        try {
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $entryName, 'Optimal') | Out-Null
        } catch { }
        if ($wsCount % 500 -eq 0) { Write-Host "  workspace: $wsCount files processed..." }
    }
    Write-Host "  workspace: $wsCount files"
    Write-Host "Total: $($count + $wsCount) files archived"
} finally {
    $zip.Dispose()
}

if (Test-Path $finalZip) {
    $sizeMB = [math]::Round((Get-Item $finalZip).Length / 1MB, 1)
    Write-Host "SUCCESS: Full backup complete"
    Write-Host "Location: $finalZip"
    Write-Host "Size: $sizeMB MB"
} else {
    Write-Host "ERROR: Backup failed"
}
