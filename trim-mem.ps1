$c = Get-Content "C:\Users\Administrator\.qclaw\workspace-agent-1f90a168\MEMORY.md" -Raw
$pattern = "(?s)## Seedance 2.0 导演式分镜规范.*?## 三角洲行动知识库"
$replacement = "### Seedance 2.0（详细见archive/seedance-*.md）
公式：主体+动作+场景+光线+镜头+风格+画质+约束
约束7条：面部/手指/动作/闪烁/水印/版权IP/名人脸 | 新手5-8秒，进阶5秒x多段

## 三角洲行动知识库"
$newContent = $c -replace $pattern, $replacement
$newContent | Set-Content "C:\Users\Administrator\.qclaw\workspace-agent-1f90a168\MEMORY.md" -NoNewline -Encoding UTF8
Write-Host "Done. Size: $((Get-Item 'C:\Users\Administrator\.qclaw\workspace-agent-1f90a168\MEMORY.md').Length) bytes"
