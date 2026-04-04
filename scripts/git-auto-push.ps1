#!/usr/bin/env pwsh
# Git Auto Commit & Push Script for OpenClaw
# Usage: Run this after modifying MEMORY.md or other config files

$workspace = "$env:USERPROFILE\.qclaw\workspace-agent-1f90a168"
$gitUser = "超级经理"
$gitEmail = "bot@openclaw.local"

Set-Location $workspace

# Check if there are changes
$status = git status --porcelain
if (-not $status) {
    Write-Host "No changes to commit"
    exit 0
}

# Get timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Commit and push
git add -A
git commit -m "auto: 记忆更新 $timestamp"
git push origin main

Write-Host "Committed and pushed at $timestamp"
