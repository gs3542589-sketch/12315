# OpenClaw Full Backup Script v3
# Backs up: .openclaw + workspace-agent-1f90a168 -> D:\backup\ + GitHub Release

Add-Type -AssemblyName System.IO.Compression.FileSystem

$backupDir = "D:\backup"
$dateStr = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$dateLabel = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$finalZip = Join-Path $backupDir "openclaw_full_backup_$dateStr.zip"
$repo = "gs3542589-sketch/12315"

$srcOpenclaw = "$env:USERPROFILE\.openclaw"
$srcWorkspace = "$env:USERPROFILE\.qclaw\workspace-agent-1f90a168"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force
}

Write-Host "=== Step 1: Creating local ZIP backup ==="
if (Test-Path $finalZip) { Remove-Item $finalZip -Force }
$zip = [System.IO.Compression.ZipFile]::Open($finalZip, 'Create')
$count = 0
try {
    # Add openclaw files
    $openclawFiles = Get-ChildItem $srcOpenclaw -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch '\\logs\\' -and $_.FullName -notmatch '\\node_modules\\' }
    foreach ($file in $openclawFiles) {
        $count++
        $relPath = $file.FullName.Substring($srcOpenclaw.Length).TrimStart('\') -replace '\\', '/'
        $entryName = "openclaw/" + $relPath
        try { [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $entryName, 'Optimal') | Out-Null } catch { }
    }
    Write-Host "  openclaw: $($openclawFiles.Count) files"

    # Add workspace files
    $workspaceFiles = Get-ChildItem $srcWorkspace -Recurse -File -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch '\\node_modules\\' -and $_.FullName -notmatch '\\\.git\\' -and $_.FullName -notmatch '\\temp\\' -and $_.FullName -notmatch '\\output\\' -and $_.FullName -notmatch '\\logs\\' }
    $wsCount = 0
    foreach ($file in $workspaceFiles) {
        $wsCount++
        $relPath = $file.FullName.Substring($srcWorkspace.Length).TrimStart('\') -replace '\\', '/'
        $entryName = "workspace/" + $relPath
        try { [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $entryName, 'Optimal') | Out-Null } catch { }
        if ($wsCount % 500 -eq 0) { Write-Host "  workspace: $wsCount files processed..." }
    }
    Write-Host "  workspace: $wsCount files"
    Write-Host "  Total: $($count + $wsCount) files"
} finally {
    $zip.Dispose()
}

$sizeMB = [math]::Round((Get-Item $finalZip).Length / 1MB, 1)
Write-Host "  Local backup: $finalZip ($sizeMB MB)"

Write-Host ""
Write-Host "=== Step 2: Uploading to GitHub Release ==="

# Delete old release if exists (prevents accumulation, keeps only latest)
Write-Host "  Removing previous GitHub release if exists..."
gh api "repos/$repo/releases/tags/openclaw-backup" --method DELETE 2>$null
Write-Host "  Creating new GitHub release..."

# Create new release with the zip as asset
$output = gh release create openclaw-backup `
    --repo $repo `
    --title "OpenClaw Backup $dateLabel" `
    --notes "Backup date: $dateLabel`nFile: openclaw_full_backup_$dateStr.zip" `
    --prerelease `
    $finalZip `
    2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "  GitHub Release uploaded successfully"
    Write-Host "  $output"
} else {
    Write-Host "  GitHub upload failed: $output"
}

Write-Host ""
Write-Host "=== Backup Complete ==="
Write-Host "  Local: $finalZip ($sizeMB MB)"
Write-Host "  GitHub: Release 'openclaw-backup' updated"
